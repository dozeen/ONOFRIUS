/**
 * ConversationDynamicsEngine.js - Decide COME partecipare alla conversazione (Energia, Chiusura, Modalità)
 */

class ConversationDynamicsEngine {
    evaluateDynamics(context) {
        const text = (context.text || (context.event && context.event.text) || "").trim().toLowerCase();
        const isOwner = !!context.isOwner;
        const timeSinceLast = context.timeSinceLastMessage || 0;

        // 1. Chiusura Conversazione (Non avere l'ultima parola)
        const closingKeywords = ["ok grazie", "grazie mille", "perfetto grazie", "a dopo", "ci aggiorniamo", "buona giornata", "buona serata", "va bene grazie"];
        const isClosingMessage = closingKeywords.some(k => text.includes(k));

        if (isClosingMessage) {
            return {
                energy: 0,
                shouldCloseConversation: true,
                participationMode: "close_conversation",
                suggestedReply: isOwner ? "Ok." : "Va bene."
            };
        }

        // 2. Calcolo dell'Energia della Risposta (0, 1, 2)
        let energy = 1; // Default: naturale / riflessivo
        let mode = "reflective";

        // Messaggi brevi o conferme semplici -> Energy 0
        if (text.length < 15 || text === "ok" || text === "grazie") {
            energy = 0;
            mode = "synthetic";
        }
        // Messaggi complessi o problemi tecnici -> Energy 2
        else if (text.length > 150 || text.includes("problema") || text.includes("bug") || text.includes("errore")) {
            energy = 2;
            mode = "expansive";
        }

        return {
            energy,
            shouldCloseConversation: false,
            participationMode: mode,
            timeSinceLast
        };
    }
}

module.exports = new ConversationDynamicsEngine();
