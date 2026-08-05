class EventDispatcher {

    constructor(consolidators = []) {

        this.consolidators = consolidators;

    }

    async dispatch(events) {

        for (const event of events) {

            for (const consolidator of this.consolidators) {

                if (typeof consolidator.process === "function") {

                    await consolidator.process(event);

                }

            }

        }

        for (const consolidator of this.consolidators) {

            if (typeof consolidator.finish === "function") {

                await consolidator.finish();

            }

        }

    }

}

module.exports = EventDispatcher;
