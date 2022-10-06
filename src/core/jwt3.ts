export interface IJWT3<T> {
    header: { alg: string, typ: string };
    payload: T;
    signature: string;
}


// Alternative to EIP-4361
export class JWT3 {
    public static async sign<T>(payload: T, sign: (msg: string) => Promise<string>): Promise<string> {
        return this.deflate({
            header: {alg: 'W3', typ: 'JWT3'},
            payload,
            signature: await sign('Login to your Wallet')
        });
    }

    /*

        public static async verify<T>(jwt: string): Promise<{address: string, payload:T}> {
            return {address: "", payload: undefined};
        }

     */

    private static inflate<T>(jwt: string): IJWT3<T> {
        const components = jwt
            .split('.')
            .map(c => Buffer.from(c, 'base64').toString('utf8'));

        if (components.length !== 3)
            throw new Error('Invalid JWT3 format');

        return {
            header: JSON.parse(components[0]),
            payload: JSON.parse(components[1]),
            signature: components[2]
        }
    }

    private static deflate<T>(jwt: IJWT3<T>): string {
        const components = [
            JSON.stringify(jwt.header),
            JSON.stringify(jwt.payload),
            jwt.signature
        ];

        return components
            .map(c => Buffer.from(c, 'utf8').toString('base64'))
            .join('.');
    }
}

