/**
 * GroupMoodEvaluator.js - Valuta il mood collettivo espanso del gruppo
 * Stati: lighthearted, serious, organizing, celebrating, worried, conflict, nostalgic, supportive
 */

class GroupMoodEvaluator {
    evaluateMood(history = []) {
        if (!history || history.length === 0) {
            return { mood: "casual", confidence: 0.8 };
        }

        let scores = {
            lighthearted: 0,
            serious: 0,
            organizing: 0,
            celebrating: 0,
            worried: 0,
            conflict: 0,
            nostalgic: 0,
            supportive: 0
        };

        for (const item of history.slice(-50)) {
            const text = (item.text || "").toLowerCase();

            if (text.match(/auguri|congratulazion|festa|brindis|cin|evviva|❤️/)) scores.celebrating++;
            else if (text.match(/preoccupat|ansia|paura|speriamo|pericolo/)) scores.worried++;
            else if (text.match(/sbagliat|basta|assurdo|vergogna|niente affatto|smettila/)) scores.conflict++;
            else if (text.match(/ti sono vicino|condoglianze|abbraccio|forza|coraggio/)) scores.supportive++;
            else if (text.match(/ti ricordi|una volta|tempo fa|vecchi tempi|ricordi/)) scores.nostalgic++;
            else if (text.match(/ahah|huhu|scherz|battut|divert|😂|🤣|😅/)) scores.lighthearted++;
            else if (text.match(/problema|errore|bug|grave|ospedale|medico|incidente/)) scores.serious++;
            else if (text.match(/riunione|alle|ore|domani|organizz|programma|appuntamento/)) scores.organizing++;
        }

        let dominantMood = "lighthearted";
        let maxScore = -1;

        for (const [mood, count] of Object.entries(scores)) {
            if (count > maxScore) {
                maxScore = count;
                dominantMood = mood;
            }
        }

        if (maxScore === 0) dominantMood = "lighthearted";

        return {
            mood: dominantMood,
            confidence: 0.85,
            breakdown: scores
        };
    }
}

module.exports = new GroupMoodEvaluator();
