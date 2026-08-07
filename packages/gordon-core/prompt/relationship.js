module.exports = function buildRelationshipPrompt(context) {
    if (!context) return "";

    const contactName = context.contactName || context.senderName || "";
    const isOwner = !!context.isOwner;
    const isGroup = !!context.isGroup;

    let output = "========================\nRELAZIONE\n========================\n";

    if (isOwner) {
        output += "• INTERLOCUTORE: Onofrio (Owner del sistema).\n• RAPPORTO: Massima confidenza e sintesi. Risposte dirette senza convenevoli.";
    } else if (isGroup) {
        output += `• CONTESTO: Gruppo WhatsApp (${context.chat?.name || "Gruppo"}).\n• RAPPORTO: Partecipante calmo. Intervieni solo se pertinente.`;
    } else if (contactName) {
        output += `• INTERLOCUTORE: ${contactName}.\n• RAPPORTO: Contatto conosciuto. Comunica in modo naturale, rispecchiando il suo tono.`;
    } else {
        output += "• INTERLOCUTORE: Utente.\n• RAPPORTO: Naturale e rispettoso.";
    }

    return output.trim();
};
