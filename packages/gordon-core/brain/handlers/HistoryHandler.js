const History = require("../../history/history");

class HistoryHandler {

    constructor() {
        this.history = new History();
    }

    async process(context) {
        const text = context.text || (context.event && context.event.text) || "";
        const chatId = context.chatId || (context.transport && context.transport.chatId);

        // Salva il messaggio utente in arrivo nello storico se non è un broadcast/status e non vuoto
        if (chatId && text.trim() && !context.isStatus && !context.isPassivePerception) {
            try {
                await this.history.saveUser(chatId, context);
            } catch (err) {
                console.error("Errore salvataggio HistoryHandler.saveUser:", err.message);
            }
        }

        context.history = await this.history.load(chatId);
        return context;
    }

    async save(context) {
        const chatId = context.chatId || (context.transport && context.transport.chatId);
        if (chatId) {
            await this.history.saveUser(chatId, context);
        }
    }

}

module.exports = HistoryHandler;
