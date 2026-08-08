const { EventStore } = require("../events");
const PerceptionEngine = require("../perception/PerceptionEngine");
const logger = require("../logger");

class EventPipeline {
    constructor() {
        this.store = EventStore;
        this.perception = new PerceptionEngine();
    }

    async process(context) {
        const event = context.event;
        if (!event) return context;

        if (!this.store.get(event.id)) {
            this.store.add(event);
        }

        const cognitiveEvents = this.perception.analyze(context);
        for (const cognitiveEvent of cognitiveEvents) {
            this.store.add(cognitiveEvent);
        }

        context.events = cognitiveEvents;
        logger.debug("EventPipeline", `⚡ [EventPipeline] Evento processato: ${event.kind || 'event'} (${event.actor || 'user'} -> ${event.source || 'system'})`);

        return context;
    }
}

module.exports = EventPipeline;
