export class Storage {
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
