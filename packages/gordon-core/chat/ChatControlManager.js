/**
 * ChatControlManager.js - Gestione dello Stato di Chat (Seen / Muted) per ONOFRIUS
 */

const fs = require("fs");
const path = require("path");

class ChatControlManager {
    constructor() {
        this.filePath = path.resolve(__dirname, "../config/chatState.json");
        this.seenChats = new Set();
        this.mutedChats = new Set();
        this.loadState();
    }

    loadState() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
                this.seenChats = new Set(data.seenChats || []);
                this.mutedChats = new Set(data.mutedChats || []);
            }
        } catch (e) {
            console.error("⚠️ Errore caricamento chatState.json:", e.message);
        }
    }

    saveState() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const data = {
                seenChats: Array.from(this.seenChats),
                mutedChats: Array.from(this.mutedChats)
            };
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
        } catch (e) {
            console.error("⚠️ Errore salvataggio chatState.json:", e.message);
        }
    }

    isFirstResponse(chatId) {
        if (!chatId) return false;
        return !this.seenChats.has(chatId);
    }

    markAsSeen(chatId) {
        if (!chatId) return;
        this.seenChats.add(chatId);
        this.saveState();
    }

    isMuted(chatId) {
        if (!chatId) return false;
        return this.mutedChats.has(chatId);
    }

    muteChat(chatId) {
        if (!chatId) return;
        this.mutedChats.add(chatId);
        this.saveState();
    }

    unmuteChat(chatId) {
        if (!chatId) return;
        this.mutedChats.delete(chatId);
        this.saveState();
    }
}

module.exports = new ChatControlManager();
