module.exports = function (context) {

    const c = context.identity?.contact;

    if (!c)
        return "";

    return `
# IDENTITÀ

Nome:
${c.name}

Tipo:
${c.type}

Relazione:
${c.relationship}

Modello:
${c.model}

Personalità:
${c.personality}

Stile:

- Verbosità: ${c.style?.verbosity}
- Emoji: ${c.style?.emoji}
- Small Talk: ${c.style?.smallTalk}
- Umorismo: ${c.style?.humor}
- Romantico: ${c.style?.romantic}
- Spiegazioni: ${c.style?.explanations}
`;

};
