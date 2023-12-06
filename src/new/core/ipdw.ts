const MESSAGE = `**Important Security Notice: Please read carefully before proceeding**

Login to InterPlanetary Data Wallet - Version: 1.0.0 - Accessing Wallet Section: {{section}}

By signing this message, you are granting access to your InterPlanetary Data Wallet section. Please take note of the following:
1. **Verify URL:** Ensure that you're on a trusted website before signing this message. Phishing sites may attempt to deceive you into signing messages for malicious purposes.
2. **Keep Private:** Do not share the content of this message with anyone. This message is unique to your account and should only be used for logging in to your designated wallet section.
3. **No Expiry:** The resulting signature does not expire and will provide access to the specified wallet section indefinitely. Keep it secure.
4. **Personal Responsibility:** You are solely responsible for any actions taken using your wallet after signing this message. Be cautious and only proceed if you understand the implications.

By signing this message, you acknowledge that you have read and understood the above warnings. If you do not agree or are unsure about any aspect, DO NOT proceed with signing.`;

export async function SignMessage(signer: (msg: string) => Promise<string>, section: string = 'Global'): Promise<string> {
    return await signer(MESSAGE.replace('{{section}}', section));
}

export class IPDW {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

}
