export class ArrayUtils {
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
}
