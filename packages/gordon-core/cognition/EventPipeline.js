const {
    EventStore
} = require("../events");

const PerceptionEngine =
    require("../perception/PerceptionEngine");

class EventPipeline {

    constructor() {

        this.store = EventStore;

        this.perception =
            new PerceptionEngine();

    }

    async process(context) {

        const event = context.event;

        if (!event) {

            return context;

        }

        // Salva l'evento originale
        if (!this.store.get(event.id)) {

            this.store.add(event);

        }

        // Analisi percettiva
        const cognitiveEvents =
            this.perception.analyze(context);

        // Salva gli eventi cognitivi
        for (const cognitiveEvent of cognitiveEvents) {

            this.store.add(cognitiveEvent);

        }

        context.events = cognitiveEvents;

        console.log("");
        console.log("========== EVENT PIPELINE ==========");

        for (const e of this.store.all()) {

            console.log(
                `[${e.kind}] ${e.actor} -> ${e.source}`
            );

        }

        console.log("====================================");
        console.log("");

        return context;

    }

}

module.exports = EventPipeline;
