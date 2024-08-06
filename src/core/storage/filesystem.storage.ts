import {StorageProvider} from "./";
import fs from "fs";

export class FileSystemStorageProvider implements StorageProvider {
    private readonly basePath: string;

    constructor(basePath: string = ".storage/") {
        this.basePath = basePath;

        if (!fs.existsSync(this.basePath))
            fs.mkdirSync(this.basePath, {recursive: true});
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (value)
            await fs.promises.writeFile(this.basePath + key, value)
        else
            await fs.promises.unlink(this.basePath + key)
    }

    public async has(key: string): Promise<boolean> {
        return fs.existsSync(this.basePath + key);
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        return fs.existsSync(this.basePath + key) ? fs.promises.readFile(this.basePath + key) : undefined;
    }

    public async ls(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(this.basePath, (err, files) => err ? reject(err) : resolve(files))
        });
    }

    public async clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.rmdir(this.basePath, (err) => err ? reject(err) : resolve())
        });
    }
}
