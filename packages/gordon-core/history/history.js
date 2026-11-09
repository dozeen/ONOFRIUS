const ChatStore = require("./chatStore");

class History {

    constructor() {

        this.store = new ChatStore();

    }

    async saveUser(chatId, context) {

        await this.store.append(chatId, {

            id: context.id,
            timestamp: context.timestamp,
            sender: context.sender,
            source: context.source,
            role: "user",
            text: context.text

        });

    }

    async saveAssistant(chatId, text, source = "CLI") {

        await this.store.append(chatId, {

            id: `${Date.now()}-assistant`,
            timestamp: Date.now(),
            sender: "Gordon",
            source,
            role: "assistant",
            text

        });

    }

    async load(chatId, limit = 30) {

        return await this.store.loadLast(chatId, limit);

    }

}

module.exports = History;
