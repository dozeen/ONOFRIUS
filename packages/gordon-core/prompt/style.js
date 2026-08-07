/**
 * style.js - Formattatore della sezione STYLE per Prompt Builder 2.1
 */

const InteractionEngine = require("../cognition/interaction/InteractionEngine");

module.exports = function buildStylePrompt(context) {
    if (!context) return "";

    let interactionStyle = context.interactionStyle;

    if (!interactionStyle) {
        try {
            const engine = new InteractionEngine();
            interactionStyle = engine.evaluateStyle(context);
        } catch (err) {
            return "";
        }
    }

    if (!interactionStyle || !interactionStyle.profile) return "";

    const p = interactionStyle.profile;
    const directives = interactionStyle.directives || [];

    let output = "==================\nSTYLE\n==================\n";
    output += `• INTERLOCUTOR ROLE: ${p.role.toUpperCase()}\n`;
    output += `• FORMALITY LEVEL: ${(p.formality * 100).toFixed(0)}%\n`;
    output += `• EMOJI FREQUENCY: ${(p.emojiUsage * 100).toFixed(0)}%\n`;
    output += `• AFFECTION LEVEL: ${(p.affection * 100).toFixed(0)}%\n`;

    if (directives.length > 0) {
        output += "• DIRECTIVES:\n";
        for (const dir of directives) {
            output += `  - ${dir}\n`;
        }
    }

    return output.trim();
};
