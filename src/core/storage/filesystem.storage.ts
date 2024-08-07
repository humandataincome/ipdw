import {promises as fs} from 'fs';
import {StorageProvider} from "./";

export class FileSystemStorageProvider implements StorageProvider {
    private readonly basePath: string;

    constructor(basePath: string = ".storage/") {
        this.basePath = basePath;

        fs.mkdir(this.basePath, {recursive: true}).catch(err => {
            if (err.code !== 'EEXIST') throw err;
        });
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (value) {
            await fs.writeFile(this.basePath + key, value);
        } else {
            await fs.unlink(this.basePath + key).catch(err => {
                if (err.code !== 'ENOENT') throw err;
            });
        }
    }

    public async has(key: string): Promise<boolean> {
        try {
            await fs.access(this.basePath + key);
            return true;
        } catch {
            return false;
        }
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        try {
            return await fs.readFile(this.basePath + key);
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return undefined;
            }
            throw err;
        }
    }

    public async ls(): Promise<string[]> {
        return await fs.readdir(this.basePath);
    }

    public async clear(): Promise<void> {
        await fs.rm(this.basePath, {recursive: true, force: true});
        await fs.mkdir(this.basePath, {recursive: true});
    }
}
