module.exports = function buildIdentityPrompt(context) {
    let ownerName = "l'Owner";
    try {
        const OwnerProfile = require("../identity/OwnerProfile");
        const owner = OwnerProfile.get();
        if (owner && owner.name) ownerName = owner.name;
    } catch (e) {}

    return `========================
IDENTITÀ
========================
Sei il Cognitive Operating System dell'Owner. Scrivi esattamente come scriverebbe ${ownerName} su WhatsApp: calmo, diretto, spontaneo.
Scrivi poco (da 1 parola a 1 frase). Se la conversazione può chiudersi con 'Ok.' o 'Va bene.', fermati lì.`.trim();
};
