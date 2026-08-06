/**
 * AttentionEngineV2.js - Motore di Attenzione Cognitiva e Calcolo Priorità
 */

const PRIORITY_LEVELS = {
    URGENT: "URGENT",
    HIGH: "HIGH",
    NORMAL: "NORMAL",
    LOW: "LOW"
};

class AttentionEngineV2 {
    static INPUT = ["context"];
    static OUTPUT = ["attention"];

    /**
     * Calcola il livello di attenzione ed il punteggio di priorità (0-100) per il contesto corrente
     * @param {Object} context
     * @returns {Object} AttentionPayload { priority, score, reason }
     */
    evaluateAttention(context) {
        let score = 20; // Punteggio base standard
        const reasons = [];

        // 1. Social Trend / Anomalia Sociale (es. Terremoto, Papa, Borsa)
        if (context.socialTrend) {
            score += 50;
            reasons.push(`Trend/Emergenza social rilevata: ${context.socialTrend.topic}`);
        }

        // 2. Anomalia di Sistema / System Error
        if (context.systemAnomaly) {
            score += 40;
            reasons.push(`Anomalia di sistema: ${context.systemAnomaly.service}`);
        }

        // 3. Mittente prioritario (es. Owner)
        if (context.isOwner) {
            score += 30;
            reasons.push("Mittente prioritario (Owner)");
        }

        // 4. Presenza di Entità Fattuali specifiche
        if (context.facts && context.facts.entities && context.facts.entities.length > 0) {
            score += 15;
            reasons.push("Contiene entità fattuali specifiche");
        }

        score = Math.min(score, 100);

        let priority = PRIORITY_LEVELS.NORMAL;
        if (score >= 80) {
            priority = PRIORITY_LEVELS.URGENT;
        } else if (score >= 50) {
            priority = PRIORITY_LEVELS.HIGH;
        } else if (score < 20) {
            priority = PRIORITY_LEVELS.LOW;
        }

        return {
            priority: priority,
            score: score,
            reason: reasons.length > 0 ? reasons.join("; ") : "Elaborazione standard"
        };
    }
}

module.exports = AttentionEngineV2;
