const logger = require("../logger");

class EventStore {
    constructor() {
        this.events = [];
        this.processedMessageIds = new Set();
    }

    add(event) {
        if (!event) return null;

        const messageId = event.payload?.raw?.id?._serialized || event.payload?.id || event.id;

        if (messageId && this.processedMessageIds.has(messageId)) {
            logger.warn("EventStore", `⚠️ Evento duplicato ignorato per messageId: [${messageId}]`);
            return null;
        }

        if (messageId) {
            this.processedMessageIds.add(messageId);
            if (this.processedMessageIds.size > 2000) {
                const oldest = Array.from(this.processedMessageIds).slice(0, 1000);
                oldest.forEach(id => this.processedMessageIds.delete(id));
            }
        }

        this.events.push(event);

        logger.info("EventBus", JSON.stringify({
            eventId: event.id,
            messageId,
            chatId: event.metadata?.chatId || event.payload?.chatId,
            source: event.source || "whatsapp",
            timestamp: Date.now()
        }));

        return event;
    }

    all() {
        return this.events;
    }

    get(id) {
        return this.events.find(e => e.id === id);
    }

    findByKind(kind) {
        return this.events.filter(e => e.kind === kind);
    }

    findByActor(actor) {
        return this.events.filter(e => e.actor === actor);
    }

    latest(limit = 50) {
        return this.events.slice(-limit);
    }

    children(parentId) {
        return this.events.filter(e => e.parentId === parentId);
    }
}

module.exports = EventStore;
module.exports.instance = new EventStore();
