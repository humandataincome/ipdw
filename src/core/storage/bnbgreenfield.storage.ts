/*
import { Client } from '@bnb-chain/greenfield-js-sdk';

import {StorageProvider} from "./";


export class BNBGreenfieldStorageProvider implements StorageProvider {
    private client: Client;
    private bucketName: string;

    constructor(rpcUrls: string[], bucketName: string) {
        this.client = Client.create(rpcUrls);
        this.bucketName = bucketName;
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (!value) {
            await this.client.object.deleteObject({
                bucketName: this.bucketName,
                objectName: key,
            });
        } else {
            await this.client.object.createObject({
                bucketName: this.bucketName,
                objectName: key,
                body: value,
            });
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            await this.client.object.headObject(this.bucketName, key);
            return true;
        } catch (error: any) {
            if (error.message.includes('Not Found')) {
                return false;
            }
            throw error;
        }
    }

    async get(key: string): Promise<Uint8Array | undefined> {
        try {
            const response = await this.client.object.getObject({
                bucketName: this.bucketName,
                objectName: key,
            });
            return new Uint8Array(await response.arrayBuffer());
        } catch (error) {
            if (error.message.includes('Not Found')) {
                return undefined;
            }
            throw error;
        }
    }

    async ls(): Promise<string[]> {
        const response = await this.client.object.listObjects({
            bucketName: this.bucketName,
        });
        return response.objects.map(obj => obj.objectName);
    }

    async clear(): Promise<void> {
        const objects = await this.ls();
        await Promise.all(objects.map(objectName =>
            this.client.object.deleteObject({
                bucketName: this.bucketName,
                objectName,
            })
        ));
    }
}
*/
