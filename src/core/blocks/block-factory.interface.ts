export interface BlockFactory {
    decode(block: Uint8Array): Promise<Uint8Array | undefined>;

    encode(value: Uint8Array): Promise<Uint8Array>;
}
