/**
 * GroupDynamicsEngine.js - Gestione Intelligente della Partecipazione nei Gruppi WhatsApp
 * Calcola il Group Participation Score integrando la Maturità della Conoscenza (Maturity Transition Rule).
 */

class GroupDynamicsEngine {
    evaluateGroupDynamics(context) {
        if (!context || !context.isGroup) {
            return {
                isGroup: false,
                score: 10,
                shouldStaySilent: false,
                reason: "Not a group chat"
            };
        }

        const text = (context.text || (context.event && context.event.text) || "").trim().toLowerCase();
        const history = context.history || [];
        let score = 0;

        // 1. Mention esplicito del nome ("Gordon", "Onofrio", "Ono") -> +20
        const isMentioned = text.includes("gordon") || text.includes("onofrio") || text.includes("ono") || text.includes("@gordon") || text.includes("@onofrio");
        if (isMentioned) {
            score += 20;
        }

        // 2. Messaggio indirizzato direttamente o rispondi a me -> +10
        if (context.isAddressedToMe || context.replyToMyMessage) {
            score += 10;
        }

        // 3. Domanda aperta -> +15
        if (text.includes("?") || text.startsWith("chi ") || text.startsWith("cosa ") || text.startsWith("come ") || text.startsWith("quando ")) {
            score += 15;
        }

        // 3.5. REGOLA DI TRANSIZIONE PER MATURITÀ DELLA CONOSCENZA:
        // Se ONOFRIUS possiede conoscenza certa (Confidence >= 0.90 / CERTAINTY) sul tema, abbandona il silenzio ed interviene -> +25
        if (context.facts && Array.isArray(context.facts.facts) && context.facts.facts.length > 0) {
            const hasCertainKnowledge = context.facts.facts.some(f => f.confidence >= 0.90 || f.epistemicState === "CERTAINTY");
            if (hasCertainKnowledge) {
                score += 25;
            }
        }

        // 4. Saluto collettivo già ripetuto nel gruppo -> -15
        const isGreeting = text.match(/\b(buongiorno|buonasera|ciao|salve|buondì)\b/i);
        if (isGreeting) {
            const recentGreetings = history.filter(h => h.text && h.text.toLowerCase().match(/\b(buongiorno|buonasera|ciao|salve|buondì)\b/i));
            if (recentGreetings.length >= 3) {
                score -= 15;
            }
        }

        // 5. Gruppo molto rumoroso / Spammy -> -10
        if (history.length > 15) {
            score -= 10;
        }

        // 6. L'ultimo messaggio della chat è stato scritto da Gordon -> -20
        const lastMsg = history[history.length - 1];
        if (lastMsg && (lastMsg.fromMe || lastMsg.sender === "gordon" || lastMsg.origin === "gordon")) {
            score -= 20;
        }

        const shouldStaySilent = score < 0 && !isMentioned;

        return {
            isGroup: true,
            score,
            shouldStaySilent,
            reason: shouldStaySilent ? `Punteggio di partecipazione basso (${score}) - Silenzio sociale scelto per mancanza di maturità conoscitiva.` : `Partecipazione ed intervento con certezza consentiti (Score: ${score}).`
        };
    }
}

module.exports = new GroupDynamicsEngine();
