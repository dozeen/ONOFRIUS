/**
 * Gordon3
 * Perception Engine
 *
 * Analizza un Event e genera
 * Event cognitivi derivati.
 */

const {
    EventBuilder,
    EventTypes
} = require("../events");

class PerceptionEngine {

    analyze(context) {

        const event = context.event;

        if (!event) {
            return [];
        }

        const payload = event.payload ?? {};

        const text =
            String(payload.text ?? "")
                .trim();

        if (!text.length) {
            return [];
        }

        const lower = text.toLowerCase();

        const events = [];

        // =====================================
        // Richiesta
        // =====================================

        if (

            lower.includes("ricordati") ||

            lower.includes("devi")

        ) {

            events.push(

                EventBuilder.create({

                    kind: EventTypes.TASK,

                    source: "perception",

                    actor: event.actor,

                    parentId: event.id,

                    payload: {

                        subtype: "request",

                        state: "detected",

                        text

                    }

                })

            );

        }

        // =====================================
        // Appuntamento
        // =====================================

        if (

            lower.includes("alle") ||

            lower.includes("oggi") ||

            lower.includes("domani") ||

            lower.includes("lunedì") ||

            lower.includes("martedì") ||

            lower.includes("mercoledì") ||

            lower.includes("giovedì") ||

            lower.includes("venerdì") ||

            lower.includes("sabato") ||

            lower.includes("domenica")

        ) {

            events.push(

                EventBuilder.create({

                    kind: EventTypes.TASK,

                    source: "perception",

                    actor: event.actor,

                    parentId: event.id,

                    payload: {

                        subtype: "appointment",

                        state: "proposed",

                        text

                    }

                })

            );

        }

        // =====================================
        // Pagamento
        // =====================================

        if (

            lower.includes("pagare") ||

            lower.includes("pagamento") ||

            lower.includes("bonifico") ||

            lower.includes("soldi")

        ) {

            events.push(

                EventBuilder.create({

                    kind: EventTypes.TASK,

                    source: "perception",

                    actor: event.actor,

                    parentId: event.id,

                    payload: {

                        subtype: "payment",

                        state: "promised",

                        text

                    }

                })

            );

        }

        return events;

    }

}

module.exports = PerceptionEngine;
