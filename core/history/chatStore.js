const fs = require("fs/promises");
const path = require("path");

const ROOT = path.join(process.cwd(), "memory", "history");

class ChatStore {
    file(chatId) {
        const safe = chatId.replace(/[^\w\-]/g, "_");
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        return path.join(ROOT, safe, `${month}.jsonl`);
    }

    async append(chatId, message) {
        // Non salvare messaggi vuoti
        if (!message || !message.text || !message.text.trim()) return;

        const file = this.file(chatId);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.appendFile(file, JSON.stringify(message) + "\n");
    }

    /**
     * Carica gli ultimi `limit` messaggi puliti, attraversando anche i file dei mesi precedenti se necessario
     * @param {string} chatId 
     * @param {number} limit 
     * @returns {Array} Array di messaggi storici
     */
    async loadLast(chatId, limit = 30) {
        try {
            const safe = chatId.replace(/[^\w\-]/g, "_");
            const dir = path.join(ROOT, safe);

            const files = await fs.readdir(dir);
            const jsonlFiles = files.filter(f => f.endsWith(".jsonl")).sort();

            let allMessages = [];

            // Legge dai file più recenti a ritroso
            for (let i = jsonlFiles.length - 1; i >= 0; i--) {
                const file = path.join(dir, jsonlFiles[i]);
                const text = await fs.readFile(file, "utf8");
                const lines = text.trim().split("\n").filter(Boolean);
                const fileMessages = lines.map(l => {
                    try { return JSON.parse(l); } catch { return null; }
                }).filter(m => m && m.text && m.text.trim());

                allMessages = [...fileMessages, ...allMessages];
                if (allMessages.length >= limit) break;
            }

            // Rimuovi eventuali messaggi vuoti o duplicati consecutivi
            const clean = [];
            let lastText = "";
            for (const m of allMessages) {
                const trimmed = m.text.trim();
                if (trimmed && trimmed !== lastText) {
                    clean.push(m);
                    lastText = trimmed;
                }
            }

            return clean.slice(-limit);
        } catch {
            return [];
        }
    }
}

module.exports = ChatStore;
