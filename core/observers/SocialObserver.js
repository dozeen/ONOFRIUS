/**
 * SocialObserver.js - Analizzatore di trend conversazionali e segnali social
 */

const bus = require("../events/EventBus");
const logger = require("../logger");

class SocialObserver {
    constructor(opts = {}) {
        this.windowSizeMs = opts.windowSizeMs || 10 * 60 * 1000; // 10 minuti
        this.threshold = opts.threshold || 3; // N menzioni per alert
        this.history = [];
        this.ignoredWords = new Set(["ciao", "come", "cosa", "quando", "dove", "sono", "della", "delle", "dello", "degli", "tutti", "tutte", "anche", "avete", "sentito", "forte"]);
    }

    /**
     * Registra un messaggio ed analizza eventuali trend o picchi
     * @param {Object} messageEvent - { text, sender, timestamp }
     */
    observeMessage(messageEvent) {
        if (!messageEvent || !messageEvent.text) return null;

        const now = Date.now();
        const text = String(messageEvent.text);

        // Aggiungi all'history
        this.history.push({
            text: text,
            sender: messageEvent.sender || "unknown",
            time: now
        });

        // Pulisci storia oltre la finestra temporale
        this.history = this.history.filter(item => (now - item.time) <= this.windowSizeMs);

        // Funzione helper per estrarre parole senza punteggiatura
        const getCleanWords = (t) => {
            const clean = t.toLowerCase().replace(/[^\w\sàèéìòù]/gi, ' ');
            return clean.split(/\s+/).filter(w => w.length > 3 && !this.ignoredWords.has(w));
        };

        const wordCounts = {};

        for (const item of this.history) {
            const itemWords = new Set(getCleanWords(item.text));
            for (const w of itemWords) {
                wordCounts[w] = (wordCounts[w] || 0) + 1;
            }
        }

        for (const [word, count] of Object.entries(wordCounts)) {
            if (count >= this.threshold) {
                const alertEvent = {
                    type: "social.trend",
                    topic: word,
                    count: count,
                    timestamp: new Date().toISOString()
                };

                logger.warn("SocialObserver", `🔥 Trend / Evento Improvviso Rilevato: "${word.toUpperCase()}" (Menzionato ${count} volte)`);
                bus.emit("social.trend", alertEvent);
                return alertEvent;
            }
        }

        return null;
    }
}

module.exports = SocialObserver;
