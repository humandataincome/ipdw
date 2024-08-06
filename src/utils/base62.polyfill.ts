import {Buffer} from 'buffer';

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = 62n;

function encodeBase62(buffer: Buffer): string {
    let number = BigInt(`0x${buffer.toString('hex')}`);
    if (number === 0n) return '0';

    let result = '';
    while (number > 0) {
        result = BASE62[Number(number % BASE)] + result;
        number = number / BASE;
    }

    return result;
}

function decodeBase62(str: string): Buffer {
    let number = 0n;
    for (let i = 0; i < str.length; i++) {
        number = number * BASE + BigInt(BASE62.indexOf(str[i]));
    }

    const hex = number.toString(16);
    const paddedHex = hex.length % 2 ? '0' + hex : hex;
    return Buffer.from(paddedHex, 'hex');
}

declare global {
    interface Buffer {
        toBase62(): string;
    }

    interface BufferConstructor {
        fromBase62(str: string): Buffer;
    }
}

Buffer.prototype.toBase62 = function (): string {
    return encodeBase62(this);
};

Buffer.fromBase62 = function (str: string): Buffer {
    return decodeBase62(str);
};
