import {StorageProvider} from "../storage";


export class VersionedOverlay implements StorageProvider {
    private storageProvider: StorageProvider;

    private currentVersion: string = '3.0.0';

    constructor(storageProvider: StorageProvider) {
        this.storageProvider = storageProvider;
    }

    public static async Init(storageProvider: StorageProvider): Promise<VersionedOverlay> {
        const overlay = new VersionedOverlay(storageProvider);
        await overlay.migrateIfNeeded();
        return overlay;
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (key === '__version__')
            throw Error('Reserved key');

        if (!(await this.storageProvider.has('__version__')))
            await this.storageProvider.set('__version__', Buffer.from(this.currentVersion, 'utf8'));

        return this.storageProvider.set(key, value);
    }

    public async has(key: string): Promise<boolean> {
        return this.storageProvider.has(key);
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        return this.storageProvider.get(key);
    }

    public async ls(): Promise<string[]> {
        return (await this.storageProvider.ls()).filter(k => k !== '__version__');
    }

    public async clear(): Promise<void> {
        return this.storageProvider.clear();
    }

    private async migrateIfNeeded(): Promise<void> {
        const version = await this.storageProvider.get('__version__');

        if (!version)
            return

        const versionString = Buffer.from(version).toString('utf8');

        switch (versionString) {
            // case '1.0.0': // Check old versions and migrate

            case this.currentVersion:
                // Current
                break;

            default:
                throw Error('Unsupported version')
        }

        // Remember that at the end of every migration, also version should be set
    }
}
