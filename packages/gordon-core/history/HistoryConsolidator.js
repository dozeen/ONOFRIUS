/**
 * HistoryConsolidator.js - Compattatore e Pulitore dello Storico Conversazioni per Gordon 3
 * 
 * Pulisce e compatta i file di storico (.jsonl) in memory/history/:
 * 1. Rimuove messaggi vuoti (text: "")
 * 2. Rimuove messaggi duplicati consecutivi o auto-risposte in loop
 * 3. Rimuove tracce di errori o note cognitive grezze
 * 4. Preserva una cronologia di dialogo pulita, ricca ed elegante per Gordon
 */

const fs = require("fs/promises");
const path = require("path");

const ROOT = path.join(process.cwd(), "memory", "history");

class HistoryConsolidator {
    /**
     * Esegue il consolidamento e la pulizia su tutto lo storico delle conversazioni
     * @returns {Object} Risultato del consolidamento { processedChats, cleanedMessages, removedDuplicates }
     */
    static async consolidateAll() {
        const stats = {
            processedChats: 0,
            cleanedMessages: 0,
            removedDuplicates: 0
        };

        try {
            const chatDirs = await fs.readdir(ROOT);

            for (const chatDir of chatDirs) {
                const chatPath = path.join(ROOT, chatDir);
                const stat = await fs.stat(chatPath);

                if (stat.isDirectory()) {
                    const files = await fs.readdir(chatPath);
                    const jsonlFiles = files.filter(f => f.endsWith(".jsonl"));

                    for (const file of jsonlFiles) {
                        const filePath = path.join(chatPath, file);
                        const fileStats = await HistoryConsolidator.consolidateFile(filePath);
                        stats.cleanedMessages += fileStats.cleanedMessages;
                        stats.removedDuplicates += fileStats.removedDuplicates;
                    }
                    stats.processedChats++;
                }
            }
        } catch (err) {
            console.error("❌ Errore in HistoryConsolidator:", err.message);
        }

        return stats;
    }

    /**
     * Consolidamento di un singolo file .jsonl
     * @param {string} filePath 
     */
    static async consolidateFile(filePath) {
        const stats = { cleanedMessages: 0, removedDuplicates: 0 };

        try {
            const rawText = await fs.readFile(filePath, "utf8");
            const lines = rawText.trim().split("\n").filter(Boolean);
            const messages = [];

            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    messages.push(parsed);
                } catch {
                    // Ignora righe corrotte
                }
            }

            const cleanMessages = [];
            let lastText = "";

            for (const msg of messages) {
                const text = (msg.text || "").trim();

                // 1. Scarta messaggi vuoti
                if (!text) {
                    stats.cleanedMessages++;
                    continue;
                }

                // 2. Scarta note cognitive o tracce di errore interne
                if (text.startsWith("[Nota Cognitiva") || text.startsWith("Fact/Privacy Verification Failed")) {
                    stats.cleanedMessages++;
                    continue;
                }

                // 3. Scarta messaggi duplicati consecutivi identici
                if (text === lastText) {
                    stats.removedDuplicates++;
                    continue;
                }

                lastText = text;
                cleanMessages.push({
                    id: msg.id || `${Date.now()}_clean`,
                    timestamp: msg.timestamp || Date.now(),
                    sender: msg.sender || "unknown",
                    role: msg.role || "user",
                    text: text
                });
            }

            // Sovrascrivi il file con lo storico compattato e pulito
            const newContent = cleanMessages.map(m => JSON.stringify(m)).join("\n") + (cleanMessages.length > 0 ? "\n" : "");
            await fs.writeFile(filePath, newContent, "utf8");

        } catch (err) {
            console.error(`❌ Errore durante la pulizia di ${filePath}:`, err.message);
        }

        return stats;
    }
}

module.exports = HistoryConsolidator;
