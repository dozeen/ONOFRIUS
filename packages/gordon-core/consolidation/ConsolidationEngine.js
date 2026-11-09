const EventReader = require("./EventReader");
const StateManager = require("./StateManager");
const EventDispatcher = require("./EventDispatcher");

const KnowledgeConsolidator = require("./KnowledgeConsolidator");

class ConsolidationEngine {

    async run() {

        const stateManager = new StateManager();
        const state = stateManager.load();

        console.log();
        console.log("🌙 =================================");
        console.log("🌙 MEMORY CONSOLIDATION");
        console.log("🌙 =================================");
        console.log();

        console.log("📦 Stato precedente");
        console.log(state);
        console.log();

        console.log("📖 Lettura Event...");

        const reader = new EventReader();

        const events = await reader.read({

            since: state.lastProcessedTimestamp

        });

        console.log(`✅ Nuovi eventi: ${events.length}`);

        const knowledge = new KnowledgeConsolidator();

        const dispatcher = new EventDispatcher([

            knowledge

        ]);

        await dispatcher.dispatch(events);

        const newState = {

            version: 1,

            lastRun: new Date().toISOString(),

            lastProcessedTimestamp:
                events.length > 0
                    ? events[events.length - 1].timestamp
                    : state.lastProcessedTimestamp,

            processedEvents:
                state.processedEvents + events.length

        };

        stateManager.save(newState);

        console.log();

        console.log("🧠 Report");

        console.log({

            knowledge: knowledge.report()

        });

        console.log();

        console.log("✅ Consolidamento completato.");
        console.log();

    }

}

module.exports = ConsolidationEngine;
