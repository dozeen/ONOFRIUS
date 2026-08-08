/**
 * ToneEngine.js - Rileva il Registro Relazionale (Romantic, Flirt, Ironic, Casual, Family, Technical, Business, Serious)
 * Evita di trasformare conversazioni affettive o scherzose in dialoghi professionali o assistenziali.
 */

class ToneEngine {
    evaluateTone(context) {
        const text = (context.text || (context.event && context.event.text) || "").toLowerCase().trim();
        const contactRel = (context.contact && context.contact.relationship) || (context.relationship || "").toLowerCase();

        // 1. Romantic / Flirt / Affettuoso
        if (text.match(/\b(amore|amoredimamma|tesoro|cuore|vita|bacio|baci|smack|stelle|mancanza|mi manchi|❤️|😘|😍|🥰|💖)\b/) || contactRel.includes("partner") || contactRel.includes("moglie") || contactRel.includes("fidanzata")) {
            return {
                tone: "romantic",
                instruction: "Rispondi con complicità, calore ed affetto. Puoi usare emoji o battute affettuose. Non trasformare il messaggio in una risposta professionale né cercare di risolvere problemi non richiesti."
            };
        }

        // 2. Ironico / Scherzoso
        if (text.match(/\b(ahah|huhu|scherz|battut|divert|bastardo|pirla|stronzo|cretino|😂|🤣|😅)\b/)) {
            return {
                tone: "ironic",
                instruction: "Rispondi con leggera ironia e complicità. Non spiegare la battuta e non cercare di essere utile a tutti i costi."
            };
        }

        // 3. Famiglia
        if (contactRel.includes("famiglia") || contactRel.includes("madre") || contactRel.includes("padre") || contactRel.includes("fratello") || contactRel.includes("sorella")) {
            return {
                tone: "family",
                instruction: "Rispondi con naturalezza familiare, calore e vicinanza spontanea."
            };
        }

        // 4. Tecnico / Codice / System
        if (text.match(/\b(bug|codice|build|err|errore|git|push|pull|script|server|node|python|kernel|whisper|ffmpeg|plugin)\b/)) {
            return {
                tone: "technical",
                instruction: "Sii preciso, concreto ed orientato alla soluzione semplice senza lunghi discorsi."
            };
        }

        // 5. Business / Formale
        if (contactRel.includes("cliente") || contactRel.includes("lavoro") || contactRel.includes("azienda")) {
            return {
                tone: "business",
                instruction: "Rispondi in modo educato, sollecito e professionale."
            };
        }

        // 6. Casual / Naturale (Default)
        return {
            tone: "casual",
            instruction: "Rispondi come scriverebbe Onofrio su WhatsApp: calmo, diretto, spontaneo. Non cercare sempre di essere utile: se il messaggio è solo affettuoso, scherzoso o di cortesia, mantieni lo stesso tono."
        };
    }
}

module.exports = new ToneEngine();
