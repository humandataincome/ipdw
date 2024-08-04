export class ArrayUtils {
    public static Uint8ArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++)
            if (a[i] !== b[i]) return false;
        return true;
    }

    public static Uint8ArrayMarshal(arrays: Uint8Array[]): Uint8Array {
        const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
        const totalByteLength = 4 + totalLength + (4 * arrays.length);
        const result = new Uint8Array(totalByteLength);
        const view = new DataView(result.buffer);

        view.setUint32(0, arrays.length, true);
        let offset = 4;

        arrays.forEach(arr => {
            view.setUint32(offset, arr.length, true);
            offset += 4;
            result.set(arr, offset);
            offset += arr.length;
        });

        return result;
    }

    public static Uint8ArrayUnmarshal(array: Uint8Array): Uint8Array[] {
        const result: Uint8Array[] = [];
        const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
        const numArrays = view.getUint32(0, true);
        let offset = 4;

        for (let i = 0; i < numArrays; i++) {
            const length = view.getUint32(offset, true);
            offset += 4;
            result.push(array.subarray(offset, offset + length));
            offset += length;
        }

        return result;
    }

}
