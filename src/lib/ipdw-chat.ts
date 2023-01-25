class ChatMessage {
    public payload: Buffer; // EncryptedVault packed buffer
    public sig?: Buffer;
}

export class IPDWChat {
    public async getMessages(chatId: string, since: number, to: number): Promise<ChatMessage[]> {
        return [];
    }

    // Using scheme ACK
    public async sendMessage(chatId: string, message: string): Promise<ChatMessage> {
        return null;
    }

}
