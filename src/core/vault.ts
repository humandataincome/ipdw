import * as crypto from 'crypto';

/*
    Vault encryption key: PBKDF2(SHA-256, Master Password, Vault Id, 100,100, 256)
    Login hash = PBKDF2(SHA-256, Master Password, Vault Id, 100,101, 256)
 */

class EncryptedVault {
    public version: number; // 1 Byte
    public magic: Buffer; // 9 Bytes
    public salt: string; // MAX 20 Bytes (/0 end padding)
    public hash: Buffer; // 32 Bytes
    public iv: Buffer; // 16 Bytes
    public payload: Buffer; // ? Bytes (till end)
}

export class DecryptedVault {
    public salt: string;
    public content: unknown;
}

export class Vault {
    public static passReg = '^(?=[^\\s]+)(?=.*[\\d])(?=.*[a-zA-Z])(?!.*\\s).{16,256}$';
    public static MAGIC = Buffer.from('dVOmW0td7');

    public static read(buffer: Buffer): EncryptedVault {
        const encryptedVault = new EncryptedVault();

        try {
            encryptedVault.version = buffer.subarray(0, 1).readInt8(0);
            encryptedVault.magic = buffer.subarray(1, 10);
            encryptedVault.salt = buffer.subarray(10, 30).toString('utf8').replace(/\0+$/, '');
            encryptedVault.hash = buffer.subarray(30, 62);
            encryptedVault.iv = buffer.subarray(62, 78);

            encryptedVault.payload = buffer.subarray(78, buffer.length);
        } catch (e) {
            throw e;
        }

        if (encryptedVault.magic.compare(Vault.MAGIC) !== 0) {
            throw new Error('Invalid encrypted vault file');
        }

        return encryptedVault;
    }

    public static write(encryptedVault: EncryptedVault): Buffer {
        const buffer = Buffer.alloc(1 + 9 + 20 + 32 + 16 + encryptedVault.payload.length);

        buffer.writeInt8(encryptedVault.version, 0);
        buffer.fill(encryptedVault.magic, 1);
        buffer.write(encryptedVault.salt.padEnd(20, '\0'), 10, 'utf8');
        buffer.fill(encryptedVault.hash, 30);
        buffer.fill(encryptedVault.iv, 62);
        buffer.fill(encryptedVault.payload, 78);

        return buffer; // .toString('binary');
    }

    public static encrypt(decryptedVault: DecryptedVault, masterPassword: string): EncryptedVault {
        if (!new RegExp(this.passReg).test(masterPassword)) {
            throw new Error('Password not vaild');
        }

        if (decryptedVault.salt != null && decryptedVault.salt.length > 20) {
            throw new Error('Vault salt too long');
        }

        const encryptedVault = new EncryptedVault();

        encryptedVault.version = 1;
        encryptedVault.magic = Vault.MAGIC;
        encryptedVault.salt = decryptedVault.salt || crypto.randomBytes(10).toString('hex');

        const derivedKey = crypto.pbkdf2Sync(masterPassword, encryptedVault.salt, 100100, 32, 'sha256');
        const derivedKeyHash = crypto.pbkdf2Sync(derivedKey, encryptedVault.salt, 1, 32, 'sha256');

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
        encryptedVault.hash = derivedKeyHash;
        encryptedVault.iv = iv;
        encryptedVault.payload = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(decryptedVault.content), 'utf8')), cipher.final()])

        return encryptedVault;
    }

    public static decrypt(encryptedVault: EncryptedVault, masterPassword: string): DecryptedVault {
        const decryptedVault = new DecryptedVault();

        const derivedKey = crypto.pbkdf2Sync(masterPassword, encryptedVault.salt, 100100, 32, 'sha256');
        const derivedKeyHash = crypto.pbkdf2Sync(derivedKey, encryptedVault.salt, 1, 32, 'sha256');

        if (encryptedVault.hash.compare(derivedKeyHash) !== 0) {
            throw new Error('Invalid master password');
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, encryptedVault.iv);
        decryptedVault.salt = encryptedVault.salt;
        decryptedVault.content = JSON.parse(Buffer.concat([decipher.update(encryptedVault.payload), decipher.final()]).toString('utf8'));

        return decryptedVault;
    }

    // FILE READ/WRITE PIPELINES (.ipdwv)

    public static async unlock(data: Buffer, masterPassword: string): Promise<unknown> {
        const encryptedVault = Vault.read(data);
        return Vault.decrypt(encryptedVault, masterPassword).content;
    }

    public static async lock(content: unknown, masterPassword: string, salt?: string): Promise<Buffer> {
        salt = salt || crypto.randomBytes(10).toString('hex');
        const encryptedVault = Vault.encrypt({salt, content}, masterPassword);
        return Vault.write(encryptedVault);
    }
}
