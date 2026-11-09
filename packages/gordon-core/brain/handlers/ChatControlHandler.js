/**
 * ChatControlHandler.js - Handler della Pipeline Brain per i Comandi 'stop onofrius' e 'start onofrius'
 */

const chatControl = require("../../chat/ChatControlManager");

class ChatControlHandler {
    async process(context) {
        const chatId = context.chatId || (context.event && context.event.chatId) || context.senderId;
        const text = (context.text || (context.event && context.event.text) || "").trim().toLowerCase();

        if (!chatId) return context;

        // 1. Comando di disattivazione: "stop onofrius"
        if (text === "stop onofrius") {
            chatControl.muteChat(chatId);
            console.log(`🛑 ChatControlHandler: Chat [${chatId}] disattivata via comando 'stop onofrius'.`);
            context.response = "🛑 Sistema ONOFRIUS disattivato in questa chat. Scrivi 'start onofrius' per riattivarlo.";
            context.skipLLM = true;
            context.responseBlocked = false;
            return context;
        }

        // 2. Comando di riattivazione: "start onofrius"
        if (text === "start onofrius") {
            chatControl.unmuteChat(chatId);
            console.log(`✅ ChatControlHandler: Chat [${chatId}] riattivata via comando 'start onofrius'.`);
            context.response = "✅ Sistema ONOFRIUS riattivato in questa chat.";
            context.skipLLM = true;
            context.responseBlocked = false;
            return context;
        }

        // 3. Se la chat è silenziata ed il messaggio NON è "start onofrius"
        if (chatControl.isMuted(chatId)) {
            console.log(`🔕 ChatControlHandler: Chat [${chatId}] è silenziata. Risposta automatica bloccata.`);
            context.skipLLM = true;
            context.response = null;
            context.responseBlocked = true;
            return context;
        }

        return context;
    }
}

module.exports = ChatControlHandler;
