function isSelfChat(msg) {
    if (!msg) return false;
    if (!msg.fromMe) return false;

    const fromStr = String(msg.from || "").toLowerCase();
    const toStr = String(msg.to || "").toLowerCase();

    // 1. Stesso JID esatto
    if (fromStr === toStr) return true;

    // 2. Chat diretta con se stessi o col proprio LID Owner risolto dinamicamente
    let ownerIds = [];
    try {
        const OwnerProfile = require("../../core/identity/OwnerProfile");
        const owner = OwnerProfile.get();
        if (owner && owner.id) ownerIds.push(String(owner.id).toLowerCase().replace(/@.*$/, ""));
        if (owner && Array.isArray(owner.aliases)) {
            owner.aliases.forEach(a => ownerIds.push(String(a).toLowerCase()));
        }
    } catch (e) {}

    if (ownerIds.length > 0) {
        const isFromOwner = ownerIds.some(id => fromStr.includes(id));
        const isToOwner = ownerIds.some(id => toStr.includes(id));
        return isFromOwner && isToOwner;
    }

    return false;
}

module.exports = {
    isSelfChat
};
