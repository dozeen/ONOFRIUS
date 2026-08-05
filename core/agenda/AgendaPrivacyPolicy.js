/**
 * Gordon3
 * Agenda Privacy Policy
 *
 * Decide quali informazioni dell'agenda possono essere
 * esposte al modello in base al contatto corrente.
 *
 * Principio:
 *
 *   Gordon può conoscere un'informazione senza essere
 *   autorizzato a divulgarla.
 */

class AgendaPrivacyPolicy {

    static normalize(value) {
        return String(value || "")
            .toLowerCase()
            .trim();
    }


    static isOwner(message = {}) {

        const type =
            this.normalize(message?.contact?.type);

        const relationship =
            this.normalize(message?.contact?.relationship);

        return (
            type === "owner" ||
            relationship === "owner" ||
            message?.isOwner === true
        );
    }


    static isFamily(message = {}) {

        return (
            this.normalize(message?.contact?.type) === "family"
        );
    }


    static isClient(message = {}) {

        return (
            this.normalize(message?.contact?.type) === "client" ||
            this.normalize(message?.contact?.relationship) === "cliente"
        );
    }


    static belongsToContact(event, message) {

        if (
            event?.chatId &&
            message?.chatId &&
            String(event.chatId) === String(message.chatId)
        ) {
            return true;
        }

        const contactName =
            this.normalize(message?.contact?.name);

        const person =
            this.normalize(event?.person);

        if (
            contactName &&
            person &&
            contactName === person
        ) {
            return true;
        }

        return false;
    }


    static sanitizePrivateEvent(event) {

        /*
         * Il modello può sapere che esiste un impegno,
         * ma NON cosa sia.
         */

        return {
            id: event.id,
            type: "busy",
            title: "Impegno personale",
            date: event.date,
            time: event.time || null,
            status: event.status || "planned",
            source: "privacy",
            temporalDistance:
                event.temporalDistance ?? null,
            relevanceScore:
                event.relevanceScore ?? null,

            facts: [],
            intentions: [],
            evidence: [],

            privacy: {
                redacted: true
            }
        };
    }


    static sanitizeClientEvent(event) {

        /*
         * Evento appartenente al cliente:
         * possiamo mostrare i dati operativi,
         * ma eliminiamo eventuali evidenze interne.
         */

        return {
            ...event,

            evidence: [],

            privacy: {
                redacted: false,
                scope: "contact"
            }
        };
    }


    static filter(message, agenda) {

        if (!Array.isArray(agenda)) {
            return [];
        }


        // ---------------------------------------------
        // OWNER
        // ---------------------------------------------

        if (this.isOwner(message)) {

            return agenda.map(event => ({
                ...event,
                privacy: {
                    redacted: false,
                    scope: "owner"
                }
            }));
        }


        // ---------------------------------------------
        // CLIENTE
        // ---------------------------------------------

        if (this.isClient(message)) {

            return agenda.map(event => {

                if (
                    this.belongsToContact(
                        event,
                        message
                    )
                ) {
                    return this.sanitizeClientEvent(
                        event
                    );
                }

                return this.sanitizePrivateEvent(
                    event
                );
            });
        }


        // ---------------------------------------------
        // FAMIGLIA / AMICI / ALTRI CONTATTI
        // ---------------------------------------------
        //
        // Per ora adottiamo una politica conservativa:
        // gli eventi propri del contatto sono visibili,
        // gli altri diventano semplicemente "impegni".
        //

        return agenda.map(event => {

            if (
                this.belongsToContact(
                    event,
                    message
                )
            ) {
                return {
                    ...event,

                    evidence: [],

                    privacy: {
                        redacted: false,
                        scope: "contact"
                    }
                };
            }

            return this.sanitizePrivateEvent(
                event
            );
        });
    }
}

module.exports = AgendaPrivacyPolicy;
