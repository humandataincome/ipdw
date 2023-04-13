import * as crypto from 'crypto';

export class HashUtils {

    public static pbkdf2(password: crypto.BinaryLike, salt: crypto.BinaryLike, iterations: number, keylen: number, digest: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            crypto.pbkdf2(password, salt, iterations, keylen, digest,
                (err, derivedKey) => err ? reject(err) : resolve(derivedKey)
            );
        });
    }
}
