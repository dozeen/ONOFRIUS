module.exports = function (context) {
    const c = context.identity?.contact;

    if (!c) return "";

    return `
# IDENTITÀ

Nome:
${c.name || "Unknown"}

Tipo:
${c.type || "Contact"}

Relazione:
${c.relationship || c.relation || "Standard"}

Modello:
${c.model || "qwen2.5:latest"}

Personalità:
${c.personality || "Standard"}

Stile:

- Verbosità: ${c.style?.verbosity || "Medium"}
- Emoji: ${c.style?.emoji || "Moderate"}
- Small Talk: ${c.style?.smallTalk || "Low"}
- Umorismo: ${c.style?.humor || "Light"}
- Romantico: ${c.style?.romantic || "None"}
- Spiegazioni: ${c.style?.explanations || "Concise"}
`;
};
