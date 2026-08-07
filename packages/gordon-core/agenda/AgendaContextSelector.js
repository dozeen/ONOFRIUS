/**
 * Gordon3
 * Agenda Context Selector
 *
 * Riduce l'agenda completa agli eventi realmente utili
 * per il messaggio corrente.
 *
 * Principi:
 * - priorità al contatto corrente
 * - riconoscimento di oggi/domani/dopodomani
 * - riconoscimento dei giorni della settimana
 * - riconoscimento di date esplicite
 * - ricerca per parole presenti negli eventi
 * - finestra temporale di sicurezza
 * - limite massimo di eventi inviati al modello
 */

class AgendaContextSelector {

    static normalize(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}\s]/gu, " ")
            .replace(/\s+/g, " ")
            .trim();
    }


    static localDate(date = new Date()) {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    static addDays(date, days) {

        const result = new Date(date);

        result.setHours(12, 0, 0, 0);
        result.setDate(result.getDate() + days);

        return result;
    }


    static extractTemporalTargets(text, now = new Date()) {

        const normalized = this.normalize(text);

        const targets = new Set();

        const today = new Date(now);
        today.setHours(12, 0, 0, 0);


        // ---------------------------------------------
        // OGGI / DOMANI / DOPODOMANI
        // ---------------------------------------------

        if (/\boggi\b/.test(normalized)) {
            targets.add(this.localDate(today));
        }

        if (/\bdomani\b/.test(normalized)) {
            targets.add(
                this.localDate(
                    this.addDays(today, 1)
                )
            );
        }

        if (/\bdopodomani\b/.test(normalized)) {
            targets.add(
                this.localDate(
                    this.addDays(today, 2)
                )
            );
        }


        // ---------------------------------------------
        // GIORNI DELLA SETTIMANA
        // ---------------------------------------------

        const weekdays = {

            domenica: 0,
            lunedi: 1,
            martedi: 2,
            mercoledi: 3,
            giovedi: 4,
            venerdi: 5,
            sabato: 6

        };

        for (const [name, targetDay] of Object.entries(weekdays)) {

            if (!new RegExp(`\\b${name}\\b`).test(normalized)) {
                continue;
            }

            const currentDay = today.getDay();

            let delta =
                (targetDay - currentDay + 7) % 7;

            /*
             * "mercoledì" significa il prossimo mercoledì,
             * ma se oggi è mercoledì consideriamo oggi.
             */
            const target =
                this.addDays(today, delta);

            targets.add(
                this.localDate(target)
            );
        }


        // ---------------------------------------------
        // DATE NUMERICHE: 29/07, 29-07, 29/07/2026
        // ---------------------------------------------

        const numericDate =
            /\b(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/g;

        let match;

        while ((match = numericDate.exec(normalized)) !== null) {

            const day =
                Number(match[1]);

            const month =
                Number(match[2]);

            let year =
                match[3]
                    ? Number(match[3])
                    : today.getFullYear();

            if (year < 100) {
                year += 2000;
            }

            if (
                day < 1 ||
                day > 31 ||
                month < 1 ||
                month > 12
            ) {
                continue;
            }

            targets.add(
                `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            );
        }


        // ---------------------------------------------
        // DATE ITALIANE: "29 luglio"
        // ---------------------------------------------

        const months = {

            gennaio: 1,
            febbraio: 2,
            marzo: 3,
            aprile: 4,
            maggio: 5,
            giugno: 6,
            luglio: 7,
            agosto: 8,
            settembre: 9,
            ottobre: 10,
            novembre: 11,
            dicembre: 12

        };

        for (const [monthName, monthNumber] of Object.entries(months)) {

            const regex =
                new RegExp(
                    `\\b(\\d{1,2})\\s+${monthName}(?:\\s+(\\d{4}))?\\b`,
                    "g"
                );

            let dateMatch;

            while ((dateMatch = regex.exec(normalized)) !== null) {

                const day =
                    Number(dateMatch[1]);

                const year =
                    dateMatch[2]
                        ? Number(dateMatch[2])
                        : today.getFullYear();

                if (day < 1 || day > 31) {
                    continue;
                }

                targets.add(
                    `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                );
            }
        }

        return [...targets];
    }


    static eventText(event) {

        return this.normalize([

            event?.title,

            event?.person,

            ...(Array.isArray(event?.facts)
                ? event.facts
                : []),

            ...(Array.isArray(event?.intentions)
                ? event.intentions
                : []),

            ...(Array.isArray(event?.evidence)
                ? event.evidence
                : [])

        ]
            .filter(Boolean)
            .join(" "));
    }


    static relevantWords(text) {

        const stopWords = new Set([

            "che",
            "cosa",
            "come",
            "quando",
            "dove",
            "perche",
            "con",
            "del",
            "della",
            "delle",
            "degli",
            "dei",
            "dal",
            "dallo",
            "alla",
            "alle",
            "nel",
            "nella",
            "sono",
            "sei",
            "siamo",
            "fare",
            "facciamo",
            "facciamo",
            "vorrei",
            "voglio",
            "posso",
            "puoi",
            "puo",
            "hai",
            "ho",
            "un",
            "una",
            "uno",
            "il",
            "lo",
            "la",
            "i",
            "gli",
            "le",
            "a",
            "e",
            "o",
            "di",
            "da",
            "in",
            "su",
            "mi",
            "ti",
            "ci",
            "vi",
            "io",
            "tu"

        ]);

        return this.normalize(text)
            .split(" ")
            .filter(word =>
                word.length >= 3 &&
                !stopWords.has(word)
            );
    }


    static scoreEvent(event, message, temporalTargets) {

        let score = 0;

        const eventText =
            this.eventText(event);

        const messageText =
            this.normalize(message?.text);

        const contactName =
            this.normalize(
                message?.contact?.name
            );

        const eventPerson =
            this.normalize(
                event?.person
            );


        // ---------------------------------------------
        // DATA RICHIESTA ESPLICITAMENTE
        // ---------------------------------------------

        if (
            event?.date &&
            temporalTargets.includes(event.date)
        ) {
            score += 100;
        }


        // ---------------------------------------------
        // EVENTO LEGATO AL CONTATTO
        // ---------------------------------------------

        if (
            eventPerson &&
            contactName &&
            eventPerson === contactName
        ) {
            score += 80;
        }


        if (
            event?.chatId &&
            message?.chatId &&
            String(event.chatId) ===
            String(message.chatId)
        ) {
            score += 100;
        }


        // ---------------------------------------------
        // NOME CONTATTO NEL TESTO EVENTO
        // ---------------------------------------------

        if (
            contactName &&
            contactName !== "sconosciuto" &&
            eventText.includes(contactName)
        ) {
            score += 50;
        }


        // ---------------------------------------------
        // PAROLE IN COMUNE
        // ---------------------------------------------

        const words =
            this.relevantWords(messageText);

        for (const word of words) {

            if (eventText.includes(word)) {
                score += 12;
            }
        }


        // ---------------------------------------------
        // EVENTI IMMINENTI
        // ---------------------------------------------

        if (
            typeof event?.temporalDistance === "number"
        ) {

            const hours =
                event.temporalDistance /
                (1000 * 60 * 60);

            if (hours >= -12 && hours <= 24) {
                score += 20;
            }

            else if (hours > 24 && hours <= 72) {
                score += 10;
            }

            else if (hours > 72 && hours <= 168) {
                score += 4;
            }
        }


        return score;
    }


    static select(message, agenda, options = {}) {

        if (!Array.isArray(agenda) || !agenda.length) {
            return [];
        }

        const limit =
            Number.isInteger(options.limit)
                ? options.limit
                : 8;

        const now =
            options.now instanceof Date
                ? options.now
                : new Date();

        const temporalTargets =
            this.extractTemporalTargets(
                message?.text,
                now
            );

        const scored =
            agenda.map(event => ({

                event,

                score:
                    this.scoreEvent(
                        event,
                        message,
                        temporalTargets
                    )

            }));


        let selected =
            scored
                .filter(item => item.score > 0)
                .sort((a, b) => {

                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }

                    return String(a.event.date || "")
                        .localeCompare(
                            String(b.event.date || "")
                        );
                });


        /*
         * Se l'utente cita esplicitamente una data,
         * includiamo TUTTI gli eventi di quella data
         * entro il limite.
         */

        if (temporalTargets.length) {

            const sameDate =
                scored.filter(item =>
                    temporalTargets.includes(
                        item.event?.date
                    )
                );

            const map =
                new Map();

            for (const item of [
                ...sameDate,
                ...selected
            ]) {

                const key =
                    item.event?.id ||
                    `${item.event?.date}:${item.event?.time}:${item.event?.title}`;

                if (!map.has(key)) {
                    map.set(key, item);
                }
            }

            selected =
                [...map.values()]
                    .sort((a, b) =>
                        b.score - a.score
                    );
        }


        return selected
            .slice(0, limit)
            .map(item => ({

                ...item.event,

                relevanceScore:
                    item.score

            }));
    }

}

module.exports = AgendaContextSelector;
