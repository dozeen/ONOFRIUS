const personality = require("../personality/PersonalityEngine");
const moodEvaluator = require("../cognition/interaction/InteractionMoodEvaluator");

class SocialPresence {
    evaluate(context) {
        if (!context.isGroup) {
            return { shouldReply: false };
        }

        const text = (context.text || "").toLowerCase();
        const greetings = ["buongiorno", "buona domenica", "buonasera", "ciao gordon", "salve"];
        const ritual = greetings.some(g => text.includes(g));

        if (!ritual) {
            return { shouldReply: false };
        }

        const moodCtx = moodEvaluator.evaluateMood(context);
        const replyText = personality.generateGreeting(moodCtx);

        return {
            shouldReply: true,
            debug: true,
            reply: replyText,
            reason: "ritual_greeting"
        };
    }
}

module.exports = new SocialPresence();
