import {Buffer} from 'buffer';

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = 62n;

function encodeBase62(buffer: Buffer): string {
    let number = BigInt(`0x${buffer.toString('hex')}`);
    if (number === 0n) return '0';

    let result = '';

    // Handle leading zeros
    let leadingZeroCount = 0;
    for (const byte of buffer) {
        if (byte === 0) {
            leadingZeroCount++;
        } else {
            break;
        }
    }

    // Encode the number to base62
    while (number > 0) {
        result = BASE62[Number(number % BASE)] + result;
        number = number / BASE;
    }

    // Add the leading zeroes in encoded format
    return '0'.repeat(leadingZeroCount) + result;
}

function decodeBase62(str: string): Buffer {
    let number = 0n;
    let leadingZeroCount = 0;

    // Count leading zeros
    while (leadingZeroCount < str.length && str[leadingZeroCount] === '0') {
        leadingZeroCount++;
    }

    // Decode the base62 string to a number
    for (let i = leadingZeroCount; i < str.length; i++) {
        number = number * BASE + BigInt(BASE62.indexOf(str[i]));
    }

    // Convert the number to hex and then to a buffer
    let hex = number.toString(16);
    if (hex.length % 2 !== 0) {
        hex = '0' + hex; // Ensure even length hex string
    }
    const buffer = Buffer.from(hex, 'hex');

    // Prepend leading zeros
    const result = Buffer.alloc(leadingZeroCount + buffer.length);
    buffer.copy(result, leadingZeroCount);

    return result;
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
