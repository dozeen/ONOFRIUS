module.exports = function buildContextPrompt(context) {
    if (!context) return "";

    const text = context.text || (context.event && context.event.text) || "";
    let output = "========================\nMESSAGGIO RICEVUTO\n========================\n";
    output += `"${text}"`;

    return output.trim();
};
