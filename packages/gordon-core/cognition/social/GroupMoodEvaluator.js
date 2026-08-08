/**
 * GroupMoodEvaluator.js - Valuta il mood collettivo del gruppo sulle ultime conversazioni
 */

class GroupMoodEvaluator {
    evaluateMood(history = []) {
        if (!history || history.length === 0) {
            return { mood: "casual", confidence: 0.8, breakdown: { jokesPct: 50, seriousPct: 20, orgPct: 30 } };
        }

        let jokesCount = 0;
        let seriousCount = 0;
        let organizationCount = 0;

        for (const item of history.slice(-50)) {
            const text = (item.text || "").toLowerCase();

            if (text.match(/ahah|huhu|scherz|battut|festa|divert|grazie|😂|🤣|😅/)) {
                jokesCount++;
            } else if (text.match(/problema|errore|bug|grave|ospedale|medico|incidente|brutto/)) {
                seriousCount++;
            } else if (text.match(/riunione|alle|ore|domani|organizz|programma|appuntamento/)) {
                organizationCount++;
            }
        }

        const total = history.length || 1;
        const jokesPct = Math.round((jokesCount / total) * 100);
        const seriousPct = Math.round((seriousCount / total) * 100);
        const orgPct = Math.round((organizationCount / total) * 100);

        let mood = "casual";
        if (seriousPct > 30) mood = "serious";
        else if (orgPct > 40) mood = "organizing";
        else if (jokesPct > 40) mood = "lighthearted";

        return {
            mood,
            confidence: 0.85,
            breakdown: { jokesPct, seriousPct, orgPct }
        };
    }
}

module.exports = new GroupMoodEvaluator();
