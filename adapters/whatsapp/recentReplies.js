// recentReplies.js - Tracciamento per evitare Eco-Loop su WhatsApp
const recentReplies = new Set();

function addRecentReply(text, chatId = "") {
    if (!text || typeof text !== "string") return;
    const clean = text.trim();
    const key = chatId ? `${chatId}:${clean}` : clean;
    recentReplies.add(key);
    recentReplies.add(clean);
    setTimeout(() => {
        recentReplies.delete(key);
        recentReplies.delete(clean);
    }, 15000); // 15 secondi di finestra temporale
}

function isRecentReply(text, chatId = "") {
    if (!text || typeof text !== "string") return false;
    const clean = text.trim();
    if (chatId && recentReplies.has(`${chatId}:${clean}`)) {
        return true;
    }
    return recentReplies.has(clean);
}

module.exports = {
    addRecentReply,
    isRecentReply
};
