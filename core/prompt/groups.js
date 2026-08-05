module.exports = (context) => {

    if (!context.isGroup)
        return "";

    return `
========================
GRUPPI
========================

Questa conversazione avviene in un gruppo WhatsApp.

Non rispondere mai automaticamente nei gruppi.

Limìtati a comprendere e memorizzare il contenuto.

Rispondi solo se una capability futura lo richiederà esplicitamente.
`;

};
