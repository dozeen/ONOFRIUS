const fs = require("fs");
const AgendaEngine = require("./AgendaEngine");

class GoogleCalendarImporter {

    /*
     * Google Calendar può spezzare una proprietà ICS
     * su più righe. Le righe successive iniziano
     * con spazio o tab.
     */
    static unfold(content) {

        return String(content || "")
            .replace(/\r\n/g, "\n")
            .replace(/\n[ \t]/g, "");
    }


    static unescape(value) {

        if (!value) {
            return "";
        }

        return String(value)
            .replace(/\\n/gi, "\n")
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\\\/g, "\\")
            .trim();
    }


    /*
     * Restituisce la prima proprietà ICS con quel nome.
     *
     * Funziona anche con:
     *
     * DTSTART;TZID=Europe/Rome:20260728T203000
     * DTSTART;VALUE=DATE:20260728
     */
    static property(block, name) {

        const lines = block.split("\n");

        const prefix = name.toUpperCase();

        for (const line of lines) {

            const upper = line.toUpperCase();

            if (
                !upper.startsWith(prefix + ":") &&
                !upper.startsWith(prefix + ";")
            ) {
                continue;
            }

            const colon = line.indexOf(":");

            if (colon === -1) {
                continue;
            }

            return {
                params: line.slice(
                    prefix.length,
                    colon
                ),
                value: line.slice(colon + 1)
            };
        }

        return null;
    }


    static parseDate(property) {

        if (!property?.value) {
            return null;
        }

        const value = property.value.trim();

        /*
         * YYYYMMDD
         */
        const match =
            value.match(
                /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/
            );

        if (!match) {
            return null;
        }

        const [
            ,
            year,
            month,
            day,
            hour,
            minute,
            second,
            utc
        ] = match;

        const allDay =
            !hour ||
            property.params
                .toUpperCase()
                .includes("VALUE=DATE");

        return {

            date:
                `${year}-${month}-${day}`,

            time:
                allDay
                    ? null
                    : `${hour}:${minute || "00"}:${second || "00"}`,

            allDay,

            utc:
                Boolean(utc),

            timezone:
                this.extractTimezone(
                    property.params
                )
        };
    }


    static extractTimezone(params = "") {

        const match =
            params.match(
                /TZID=([^;:]+)/i
            );

        return match
            ? match[1]
            : null;
    }


    static parseEvents(content) {

        const unfolded =
            this.unfold(content);

        const blocks =
            unfolded.match(
                /BEGIN:VEVENT[\s\S]*?END:VEVENT/g
            ) || [];

        const events = [];

        for (const block of blocks) {

            const uid =
                this.property(block, "UID");

            const summary =
                this.property(block, "SUMMARY");

            const description =
                this.property(block, "DESCRIPTION");

            const location =
                this.property(block, "LOCATION");

            const start =
                this.property(block, "DTSTART");

            const end =
                this.property(block, "DTEND");

            const status =
                this.property(block, "STATUS");

            const parsedStart =
                this.parseDate(start);

            const parsedEnd =
                this.parseDate(end);

            if (!parsedStart) {
                continue;
            }

            events.push({

                uid:
                    this.unescape(
                        uid?.value
                    ) || null,

                title:
                    this.unescape(
                        summary?.value
                    ) || "Evento Google Calendar",

                description:
                    this.unescape(
                        description?.value
                    ),

                location:
                    this.unescape(
                        location?.value
                    ),

                date:
                    parsedStart.date,

                time:
                    parsedStart.time,

                allDay:
                    parsedStart.allDay,

                timezone:
                    parsedStart.timezone,

                endDate:
                    parsedEnd?.date || null,

                endTime:
                    parsedEnd?.time || null,

                googleStatus:
                    this.unescape(
                        status?.value
                    ).toLowerCase() || null
            });
        }

        return events;
    }


    static existingGoogleUIDs() {

        const appointments =
            AgendaEngine.loadAll();

        return new Set(

            appointments

                .filter(item =>
                    item?.external?.provider ===
                    "google_calendar"
                )

                .map(item =>
                    item.external.uid
                )

                .filter(Boolean)
        );
    }


    static importFile(file, options = {}) {

        if (!file) {
            throw new Error(
                "GoogleCalendarImporter.importFile(): file obbligatorio"
            );
        }

        if (!fs.existsSync(file)) {
            throw new Error(
                `File calendario non trovato: ${file}`
            );
        }

        const content =
            fs.readFileSync(
                file,
                "utf8"
            );

        return this.importContent(
            content,
            options
        );
    }


    static importContent(content, options = {}) {

        const {
            fromDate = null,
            includePast = false,
            dryRun = false
        } = options;

        const events =
            this.parseEvents(content);

        const existing =
            this.existingGoogleUIDs();

        /*
         * Se non viene specificata una data,
         * utilizziamo la data locale del sistema.
         */
        const today =
            new Date()
                .toLocaleDateString(
                    "en-CA"
                );

        const minimumDate =
            fromDate || today;

        const report = {

            parsed: events.length,

            imported: 0,

            duplicates: 0,

            past: 0,

            cancelled: 0,

            invalid: 0,

            appointments: []
        };


        for (const event of events) {

            if (!event.date) {

                report.invalid++;
                continue;
            }


            /*
             * Eventi cancellati da Google.
             */
            if (
                event.googleStatus ===
                "cancelled"
            ) {

                report.cancelled++;
                continue;
            }


            /*
             * Per il primo import non trasciniamo
             * anni di calendario storico.
             */
            if (
                !includePast &&
                event.date < minimumDate
            ) {

                report.past++;
                continue;
            }


            /*
             * UID Google = chiave anti duplicazione.
             */
            if (
                event.uid &&
                existing.has(event.uid)
            ) {

                report.duplicates++;
                continue;
            }


            const facts = [];

            if (event.description) {

                facts.push(
                    `Descrizione calendario: ${event.description}`
                );
            }

            if (event.location) {

                facts.push(
                    `Luogo: ${event.location}`
                );
            }


            const data = {

                type:
                    "appointment",

                title:
                    event.title,

                date:
                    event.date,

                time:
                    event.time,

                person:
                    null,

                chatId:
                    null,

                facts,

                intentions: [],

                evidence: [
                    "Evento importato da Google Calendar"
                ],

                status:
                    "planned",

                source:
                    "google_calendar",

                external: {

                    provider:
                        "google_calendar",

                    uid:
                        event.uid,

                    allDay:
                        event.allDay,

                    timezone:
                        event.timezone,

                    endDate:
                        event.endDate,

                    endTime:
                        event.endTime
                }
            };


            /*
             * Dry run:
             * vediamo cosa importerebbe senza
             * modificare appointments.json.
             */
            if (dryRun) {

                report.appointments.push(data);
                report.imported++;

                continue;
            }


            const appointment =
                AgendaEngine.add(data);

            report.appointments.push(
                appointment
            );

            report.imported++;


            /*
             * Evita duplicati anche all'interno
             * dello stesso file ICS.
             */
            if (event.uid) {
                existing.add(event.uid);
            }
        }

report.appointments.sort((a, b) => {

    const dateA =
        `${a.date}T${a.time || "00:00:00"}`;

    const dateB =
        `${b.date}T${b.time || "00:00:00"}`;

    return dateA.localeCompare(dateB);
});

        return report;
    }

}

module.exports = GoogleCalendarImporter;
