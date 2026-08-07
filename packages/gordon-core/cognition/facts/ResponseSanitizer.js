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
            /Onofrio\s+scriverebbe\s+davvero/i,
            /Non\s+spiegare,\s+non\s+descrivere\s+cosa\s+stai\s+facendo/i,
            /Mantieni\s+lo\s+stesso\s+stile\s+e\s+la\s+stessa\s+lunghezza/i,
            /Usa\s+le\s+emoji\s+solo\s+se\s+le\s+usa/i,
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

        // Rimuove parentesi esplicative con meta-spiegazioni in fondo al messaggio
        cleaned = cleaned.replace(/\s*\([^)]*=[^)]*\)$/g, "");
        cleaned = cleaned.replace(/\s*\([^)]*significa[^)]*\)$/gi, "");
        cleaned = cleaned.replace(/\s*\([^)]*traduzione[^)]*\)$/gi, "");
        cleaned = cleaned.replace(/\s*\([^)]*nota:[^)]*\)$/gi, "");

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
