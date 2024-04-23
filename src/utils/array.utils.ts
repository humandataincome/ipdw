export class ArrayUtils {
    public static Uint8ArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++)
            if (a[i] !== b[i]) return false;
        return true;
    }

    public static Uint8ArrayMarshal(array: Uint8Array[]): Uint8Array {
        // Calculate total length of all Uint8Arrays in the array
        let totalLength = 0;
        for (const arr of array) {
            totalLength += arr.length;
        }

        // Calculate the total length of the marshalled data including the length prefixes
        const totalByteLength = 4 + totalLength + (4 * array.length);

        // Allocate a new Uint8Array with the total length
        const result = new Uint8Array(totalByteLength);

        // Write the number of arrays as a 32-bit integer at the beginning
        new DataView(result.buffer).setUint32(0, array.length, true);
        let offset = 4;

        // For each array, write its length as a 32-bit integer followed by its data
        for (const arr of array) {
            new DataView(result.buffer).setUint32(offset, arr.length, true);
            offset += 4;
            result.set(arr, offset);
            offset += arr.length;
        }

        return result;
    }

    public static Uint8ArrayUnmarshal(array: Uint8Array): Uint8Array[] {
        const result: Uint8Array[] = [];

        // Read the number of arrays as a 32-bit integer at the beginning
        const numArrays = new DataView(array.buffer, array.byteOffset, array.byteLength).getUint32(0, true);
        let offset = 4;

        // Iterate over each array
        for (let i = 0; i < numArrays; i++) {
            // Read the length of the current array as a 32-bit integer
            const length = new DataView(array.buffer, array.byteOffset, array.byteLength).getUint32(offset, true);
            offset += 4;

            // Create a new Uint8Array with the given length and copy data into it
            const subArray = array.subarray(offset, offset + length);
            result.push(subArray);

            // Move the offset to the next array
            offset += length;
        }

        return result;
    }

}
