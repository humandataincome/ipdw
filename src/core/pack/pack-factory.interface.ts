export interface PackFactory {
    decode(pack: Uint8Array): Promise<Uint8Array | undefined>;

    encode(value: Uint8Array): Promise<Uint8Array>;
}
