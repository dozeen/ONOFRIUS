/**
 * QuestionClassifier.js - Classificatore dell'Intenzione Comunicativa delle Domande per Gordon 3
 * 
 * Implementa l'Assioma della Conversazione (Assioma 11):
 * Riconosce la sfumatura comunicativa delle domande (Informativa, Emotiva, Ironica, Organizzativa, Retorica).
 */

const QUESTION_INTENTS = {
    INFORMATIVE: "INFORMATIVE",
    EMOTIONAL: "EMOTIONAL",
    IRONIC: "IRONIC",
    ORGANIZATIONAL: "ORGANIZATIONAL",
    RHETORICAL: "RHETORICAL"
};

class QuestionClassifier {
    static INPUT = ["text"];
    static OUTPUT = ["questionIntent"];

    /**
     * Classifica la sfumatura dell'intenzione comunicativa di una domanda
     * @param {string} text - Testo della domanda
     * @returns {Object} { intent: string, directive: string }
     */
    classifyIntent(text) {
        if (!text || typeof text !== "string") {
            return {
                intent: QUESTION_INTENTS.INFORMATIVE,
                directive: "Rispondi in modo naturale e diretto."
            };
        }

        const lower = text.toLowerCase().trim();

        // 1. Organizzativa / Pianificazione (es. "A che ora ci vediamo?", "Ci vediamo stasera?", "Ci sei giovedì?")
        if (lower.includes("ci vediamo") || lower.includes("ci incontriamo") || lower.includes("a che ora") || lower.includes("quando ci") || lower.includes("ci sei")) {
            return {
                intent: QUESTION_INTENTS.ORGANIZATIONAL,
                directive: "INTENZIONE ORGANIZZATIVA: Rispondi confermando disponibilità o proponendo un orario/giorno preciso con spontaneità."
            };
        }

        // 2. Emotiva (es. "Mi vuoi bene?", "Ti è piaciuta?", "Come ti senti?", "Ti manco?")
        if (lower.includes("mi vuoi bene") || lower.includes("ti è piaciut") || lower.includes("ti e piaciut") || lower.includes("come ti senti") || lower.includes("ti manco")) {
            return {
                intent: QUESTION_INTENTS.EMOTIONAL,
                directive: "INTENZIONE EMOTIVA: Rispondi con calore, affetto ed empatia mantenendo lo stile personale."
            };
        }

        // 3. Ironica (es. "Secondo te ci riusciamo?", "Davvero?", "Dici che ce la facciamo?")
        if (lower.includes("secondo te") || lower.includes("dici che") || lower.includes("davvero?")) {
            return {
                intent: QUESTION_INTENTS.IRONIC,
                directive: "INTENZIONE IRONICA: Rispondi con battuta o ironia leggera spontanea senza spiegazioni."
            };
        }

        // 4. Retorica (es. "Ma ti pare?", "Certo no?", "Non credi?")
        if (lower.includes("ma ti pare") || lower.includes("non credi") || lower.includes("certo no")) {
            return {
                intent: QUESTION_INTENTS.RHETORICAL,
                directive: "INTENZIONE RETORICA: Rispondi brevemente avvalorando o sdrammatizzando con complicità."
            };
        }

        // 5. Informativa (Default per domande generali: "Chi è?", "Che ore sono?", "Dove si trova?", "Quanto costa?")
        return {
            intent: QUESTION_INTENTS.INFORMATIVE,
            directive: "INTENZIONE INFORMATIVA: Fornisci l'informazione richiesta in modo chiaro ed essenziale."
        };
    }
}

module.exports = {
    QuestionClassifier,
    QUESTION_INTENTS
};
