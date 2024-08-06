export class Lock {
    private isLocked: boolean = false;
    private queue: (() => void)[] = [];

    async acquire(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.isLocked) {
                this.isLocked = true;
                resolve();
            } else {
                this.queue.push(resolve);
            }
        });
    }

    release(): void {
        if (this.queue.length > 0) {
            const nextResolve = this.queue.shift();
            if (nextResolve) nextResolve();
        } else {
            this.isLocked = false;
        }
    }
}

export class ReadWriteLock {
    private readers: number = 0;
    private writer: boolean = false;
    private readerQueue: (() => void)[] = [];
    private writerQueue: (() => void)[] = [];

    async acquireRead(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.writer && this.writerQueue.length === 0) {
                this.readers++;
                resolve();
            } else {
                this.readerQueue.push(resolve);
            }
        });
    }

    releaseRead(): void {
        this.readers--;
        this.tryReleaseWrite();
    }

    async acquireWrite(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.writer && this.readers === 0) {
                this.writer = true;
                resolve();
            } else {
                this.writerQueue.push(resolve);
            }
        });
    }

    releaseWrite(): void {
        this.writer = false;
        this.tryReleaseRead();
        this.tryReleaseWrite();
    }

    private tryReleaseRead(): void {
        while (this.readerQueue.length > 0 && !this.writer) {
            const readerResolve = this.readerQueue.shift();
            if (readerResolve) {
                this.readers++;
                readerResolve();
            }
        }
    }

    private tryReleaseWrite(): void {
        if (this.writerQueue.length > 0 && this.readers === 0 && !this.writer) {
            const writerResolve = this.writerQueue.shift();
            if (writerResolve) {
                this.writer = true;
                writerResolve();
            }
        }
    }
}

export function withLock(lockFn: () => Lock) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const lock = lockFn.call(this);
            await lock.acquire();
            try {
                return await originalMethod.apply(this, args);
            } finally {
                lock.release();
            }
        };
        return descriptor;
    };
}

export function withReadLock(rwLockFn: () => ReadWriteLock) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const rwLock = rwLockFn.call(this);
            await rwLock.acquireRead();
            try {
                return await originalMethod.apply(this, args);
            } finally {
                rwLock.releaseRead();
            }
        };
        return descriptor;
    };
}

export function withWriteLock(rwLockFn: () => ReadWriteLock) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const rwLock = rwLockFn.call(this);
            await rwLock.acquireWrite();
            try {
                return await originalMethod.apply(this, args);
            } finally {
                rwLock.releaseWrite();
            }
        };
        return descriptor;
    };
}
