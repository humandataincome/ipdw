export class Storage {
    //TODO: evaluate if is node or browser, the first should use file, the latter indexeddb
    private storage: Map<string, string>;

    constructor() {
        this.storage = new Map<string, string>();
    }

    public set(key: string, value: string): void {
        this.storage.set(key, value);
    }

    public get(key: string): string | undefined {
        return this.storage.get(key);
    }
}
