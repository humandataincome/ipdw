export class StreamUtils {
    // Usage reader.pipeThrough(ProgressStream(100, console.log))
    public static ProgressStream(length: number, callback: ((progress: number) => void) | undefined, offset: number = 0): TransformStream<Uint8Array, Uint8Array> {
        return new TransformStream<Uint8Array, Uint8Array>({
            async transform(chunk, controller) {
                if (callback) callback!((offset += chunk.length) / length);
                controller.enqueue(chunk);
            }
        });
    }

    // Usage reader.pipeTo(ProgressStream(100, console.log))
    public static async GetAsUint8Array(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
        const reader = stream.getReader();
        let res = new Uint8Array(0);
        let chunk;
        while (!(chunk = await reader.read()).done) {
            const tmp = new Uint8Array(res.length + chunk.value.length);
            tmp.set(res, 0);
            tmp.set(chunk.value, res.length);
            res = tmp;
        }
        return res;
    }
}
