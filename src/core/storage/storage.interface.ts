export interface StorageProvider {
    set(key: string, value: Uint8Array | undefined): Promise<void>;

    has(key: string): Promise<boolean>;

    get(key: string): Promise<Uint8Array | undefined>;

    ls(): Promise<string[]>;

    clear(): Promise<void>
}

