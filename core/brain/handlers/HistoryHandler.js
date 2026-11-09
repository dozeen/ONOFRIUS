const History = require("../../history/history");

class HistoryHandler {

    constructor() {
        this.history = new History();
    }

    async process(context) {

        context.history =
            await this.history.load(context.chatId);

        return context;

    }

    async save(context) {

        await this.history.saveUser(
            context.chatId,
            context
        );

    }

}

module.exports = HistoryHandler;
