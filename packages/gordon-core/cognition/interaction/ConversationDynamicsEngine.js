/**
 * ConversationDynamicsEngine.js - Decide il grado di Partecipazione Conversazionale (ConversationParticipation)
 */

const ParticipationStates = require("./ConversationParticipation");
const socialIntuition = require("./SocialIntuitionEngine");

class ConversationDynamicsEngine {
    evaluateDynamics(context) {
        const intuitionResult = socialIntuition.evaluateIntuition(context);

        if (intuitionResult.intuition !== "standard") {
            return {
                participation: intuitionResult.recommendedState,
                intuition: intuitionResult.intuition,
                leaveSilence: intuitionResult.leaveSilence,
                suggestedReply: intuitionResult.suggestedReply
            };
        }

        const text = (context.text || "").trim();
        const lowerText = text.toLowerCase();
        const isOwner = !!context.isOwner;
        const timeSinceLast = context.timeSinceLastMessage || 0;

        let participation = ParticipationStates.NORMAL;

        if (text.length < 15) {
            participation = ParticipationStates.MINIMAL;
        } else if (text.length > 150 || lowerText.includes("problema") || lowerText.includes("bug") || lowerText.includes("codice") || lowerText.includes("errore") || lowerText.includes("come si fa")) {
            participation = ParticipationStates.ADVISOR;
        }

        return {
            participation,
            intuition: "standard",
            leaveSilence: false,
            timeSinceLast
        };
    }
}

module.exports = new ConversationDynamicsEngine();
