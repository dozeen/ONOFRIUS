/**
 * SocialIntuitionEngine.js - Intuizione Sociale Spontanea
 * Decide la reazione sociale immediata (es. '😂😂😂', 'Boh...', 'Ti posso chiamare?')
 */

const ParticipationStates = require("./ConversationParticipation");

class SocialIntuitionEngine {
    evaluateIntuition(context) {
        const text = (context.text || (context.event && context.event.text) || "").trim().toLowerCase();
        
        // 1. Emoji di risata o reazione spontanea
        if (/^(😂|🤣|hah|ahah|huhu)+$/gi.test(text.replace(/\s+/g, ""))) {
            return {
                intuition: "laughter_reaction",
                recommendedState: ParticipationStates.MINIMAL,
                suggestedReply: "Ahah",
                leaveSilence: true
            };
        }

        // 2. Esitazione ("Boh...") -> Lascia spazio
        if (text === "boh" || text === "boh..." || text === "mah") {
            return {
                intuition: "hesitation",
                recommendedState: ParticipationStates.MINIMAL,
                suggestedReply: "Vediamo.",
                leaveSilence: true
            };
        }

        // 3. Richiesta di contatto diretto ("Ti posso chiamare?")
        if (text.includes("posso chiamare") || text.includes("ti posso chiamare") || text.includes("ti chiamo")) {
            return {
                intuition: "call_request",
                recommendedState: ParticipationStates.NORMAL,
                suggestedReply: "Sì dimmi pure.",
                leaveSilence: false
            };
        }

        // 4. Conferma o Chiusura -> Lascia il silenzio
        const closingTerms = ["ok grazie", "grazie mille", "perfetto grazie", "a dopo", "ci aggiorniamo"];
        if (closingTerms.some(term => text.includes(term))) {
            return {
                intuition: "natural_closure",
                recommendedState: ParticipationStates.MINIMAL,
                suggestedReply: context.isOwner ? "Ok." : "Va bene.",
                leaveSilence: true
            };
        }

        return {
            intuition: "standard",
            recommendedState: ParticipationStates.NORMAL,
            leaveSilence: false
        };
    }
}

module.exports = new SocialIntuitionEngine();
