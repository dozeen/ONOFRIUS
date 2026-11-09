/**
 * ConversationDynamicsEngine.js - Integrazione GroupDynamicsEngine e ConversationParticipation
 */

const ParticipationStates = require("./ConversationParticipation");
const socialIntuition = require("./SocialIntuitionEngine");
const groupDynamics = require("./GroupDynamicsEngine");

class ConversationDynamicsEngine {
    evaluateDynamics(context) {
        // 1. Valutazione Gruppo (Group Dynamics Score)
        if (context.isGroup) {
            const gDyn = groupDynamics.evaluateGroupDynamics(context);
            if (gDyn.shouldStaySilent) {
                return {
                    participation: ParticipationStates.SILENT,
                    leaveSilence: true,
                    shouldStaySilent: true,
                    groupScore: gDyn.score,
                    suggestedReply: null,
                    reason: gDyn.reason
                };
            }
        }

        // 2. Intuizione Sociale Spontanea
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
        let participation = ParticipationStates.NORMAL;

        if (text.length < 15) {
            participation = ParticipationStates.MINIMAL;
        } else if (text.length > 150 || lowerText.includes("problema") || lowerText.includes("bug") || lowerText.includes("codice") || lowerText.includes("errore")) {
            participation = ParticipationStates.ADVISOR;
        }

        return {
            participation,
            intuition: "standard",
            leaveSilence: false
        };
    }
}

module.exports = new ConversationDynamicsEngine();
