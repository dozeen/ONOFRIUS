/**
 * ResponseSanitizer.js - Sanitizzazione e Protezione Anti-Prompt-Leak per Gordon 3
 * Rimuove spiegazioni o meta-commenti tra parentesi ed intercetta la fuga di istruzioni interne prima dell'invio.
 */

class ResponseSanitizer {
    constructor() {
        this.leakForbiddenPatterns = [
            /ECCEZIONE\s*\[NO_REPLY\]/i,
            /REGOLE\s+DI\s+RISPOSTA/i,
            /RISERVATEZZA\s+ASSOLUTA/i,
            /(Owner|Onofrius)\s+scriverebbe\s+davvero/i,
            /Non\s+spiegare,\s+non\s+descrivere\s+cosa\s+stai\s+facendo/i,
            /Mantieni\s+lo\s+stesso\s+stile\s+e\s+la\s+stessa\s+lunghezza/i,
            /Usa\s+le\s+emoji\s+solo\s+se\s+le\s+usa/i,
            /HeaderCode/i,
            /Maintain\s+the\s+privacy/i,
            /(Owner|Onofrius)\s+would\s+respond/i,
            /The\s+response\s+mimics/i,
            /NoIDEO\s+che\s+(Owner|Onofrius)/i,
            /In\s+entrambi\s+i\s+casi,\s+(Owner|Onofrius)/i,
            /\[NO_REPLY\]/i,
            /PROMPT_LEAK/i
        ];
    }

    /**
     * Pulisce ed elimina meta-spiegazioni o note esplicative tra parentesi prodotte dall'LLM
     */
    sanitize(response) {
        if (!response || typeof response !== "string") return response;

        let cleaned = response.trim();

        // Rimuove blocchi HeaderCode e note meta-esplicative prodotte dall'LLM
        cleaned = cleaned.replace(/.*?HeaderCode:[^\n]*/gi, "").trim();
        cleaned = cleaned.replace(/---[\s\S]*?---/g, "\n").trim();
        cleaned = cleaned.replace(/\n\s*Note:[\s\S]*/gi, "").trim();
        cleaned = cleaned.replace(/^Note:[\s\S]*/gi, "").trim();

        // Se l'LLM risponde con ragionamento lungo ed una sezione "**Risposta:**", estrae solo la risposta reale
        if (cleaned.includes("**Risposta:**") || cleaned.includes("Risposta:")) {
            const match = cleaned.match(/(?:\*\*Risposta:\*\*|Risposta:)\s*["']?([^"'\n]+)["']?/i);
            if (match && match[1]) {
                cleaned = match[1].trim();
            }
        }

        // Rimuove prefissi esplicativi dell'LLM (es. "Certo, Federico. Ho ricevuto il tuo messaggio...")
        cleaned = cleaned.replace(/^(certo|ecco|ho ricevuto|ecco come|l'owner potrebbe rispondere).*?:/gi, "").trim();

        // Rimuove virgolette racchiudenti l'intera risposta (es. "'Ragazzone?! Ok.'" -> "Ragazzone?!")
        while ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1).trim();
        }

        // Rimuove parentesi esplicative con meta-spiegazioni in fondo al messaggio
        cleaned = cleaned.replace(/\s*\([^)]*=[^)]*\)$/g, "");
        cleaned = cleaned.replace(/\s*\([^)]*significa[^)]*\)$/gi, "");
        cleaned = cleaned.replace(/\s*\([^)]*traduzione[^)]*\)$/gi, "");
        cleaned = cleaned.replace(/\s*\([^)]*nota:[^)]*\)$/gi, "");

        // Rimuove suffissi meccanici ridondanti tipo ". Ok.", "? Ok.", " Ok." preservando la punteggiatura
        if (cleaned.length > 5) {
            cleaned = cleaned.replace(/\.\s*ok\.?$/gi, ".").trim();
            cleaned = cleaned.replace(/\?\s*ok\.?$/gi, "?").trim();
            cleaned = cleaned.replace(/\!\s*ok\.?$/gi, "!").trim();
            cleaned = cleaned.replace(/[\s,]+ok\.?$/gi, "").trim();
        }

        return cleaned.trim();
    }

    /**
     * Verifica se la risposta contiene un leak di istruzioni interne del prompt di sistema
     */
    detectLeak(response) {
        if (!response || typeof response !== "string") {
            return { leaked: false };
        }

        for (const pattern of this.leakForbiddenPatterns) {
            if (pattern.test(response)) {
                return {
                    leaked: true,
                    pattern: pattern.toString()
                };
            }
        }

        return { leaked: false };
    }
}

module.exports = ResponseSanitizer;
