/**
 * InteractionMoodEvaluator.js - Valutatore della Situazione Sociale (ConversationMood)
 */

class InteractionMoodEvaluator {
    evaluateMood(context) {
        const text = (context.text || (context.event && context.event.text) || "").trim();
        const lowerText = text.toLowerCase();
        const isGroup = !!context.isGroup;
        const isOwner = !!context.isOwner;
        const timeSinceLast = context.timeSinceLastMessage || 0;

        let mood = "casual";

        // 1. Saluti o rituali di base
        const greetings = ["buongiorno", "buonasera", "ciao gordon", "buona domenica", "salve"];
        if (greetings.some(g => lowerText.includes(g))) {
            mood = "ritual";
        }

        // 2. Discussione tecnica / problem solving
        const techKeywords = ["error", "bug", "codice", "kernel", "function", "build", "node", "git", "problema", "fix", "deploy"];
        if (techKeywords.some(k => lowerText.includes(k))) {
            mood = "technical_discussion";
        }

        // 3. Battuta / humor
        if (lowerText.includes("ahah") || lowerText.includes("huhu") || lowerText.includes("scherz") || lowerText.includes("😄")) {
            mood = "joke";
        }

        // 4. Priorità di contesto relazionale e temporale
        if (isGroup) {
            mood = "group_discussion";
        } else if (isOwner) {
            mood = "owner_message";
        }

        if (timeSinceLast > 14400000) {
            mood = "return_after_hours";
        }

        if (context.isFirstContact) {
            mood = "first_contact";
        }

        return {
            mood,
            isGroup,
            isOwner,
            textLength: text.length,
            isLongText: text.length > 250
        };
    }
}

module.exports = new InteractionMoodEvaluator();
