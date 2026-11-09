const AgendaParser = require("./AgendaParser");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const FILE = path.join(
    process.cwd(),
    "memory",
    "appointments",
    "appointments.json"
);

class AgendaEngine {

    static ensureStorage() {

        const dir = path.dirname(FILE);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (!fs.existsSync(FILE)) {
            fs.writeFileSync(FILE, "[]\n", "utf8");
        }
    }


    static loadAll() {

        this.ensureStorage();

        try {

            const raw = fs.readFileSync(FILE, "utf8").trim();

            if (!raw) {
                return [];
            }

            const data = JSON.parse(raw);

            return Array.isArray(data)
                ? data
                : [];

        } catch (err) {

            console.error(
                "❌ Agenda: impossibile leggere appointments.json:",
                err.message
            );

            return [];
        }
    }


    static saveAll(items) {

        this.ensureStorage();

        const tmp = `${FILE}.tmp`;

        fs.writeFileSync(
            tmp,
            JSON.stringify(items, null, 2) + "\n",
            "utf8"
        );

        fs.renameSync(tmp, FILE);
    }


    static normalizeContact(message) {

        return {

            chatId:
                message?.chatId ||
                message?.sender ||
                null,

            name:
                message?.contact?.name ||
                null,

            relationship:
                message?.contact?.relationship ||
                null

        };
    }


    /*
     * Registra un evento strutturato.
     */
    static add(data = {}) {

        if (!data.date) {
            throw new Error(
                "AgendaEngine.add(): date obbligatoria"
            );
        }

        const appointments = this.loadAll();

        const appointment = {

            id: crypto.randomUUID(),

            type:
                data.type ||
                "appointment",

            title:
                data.title ||
                "Evento",

            date:
                data.date,

            time:
                data.time ||
                null,

            person:
                data.person ||
                null,

            chatId:
                data.chatId ||
                null,

            facts:
                Array.isArray(data.facts)
                    ? data.facts
                    : [],

            intentions:
                Array.isArray(data.intentions)
                    ? data.intentions
                    : [],

            evidence:
                Array.isArray(data.evidence)
                    ? data.evidence
                    : [],

            status:
                data.status ||
                "planned",

            source:
                data.source ||
                "manual",
external:
    data.external &&
    typeof data.external === "object"
        ? data.external
        : null,
            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };

        appointments.push(appointment);

        this.saveAll(appointments);

        return appointment;
    }


    /*
     * Eventi appartenenti a un contatto.
     */
    static getForContact(message) {

        const appointments = this.loadAll();

        const contact =
            this.normalizeContact(message);

        return appointments.filter(item => {

            if (
                item.chatId &&
                contact.chatId &&
                String(item.chatId) ===
                String(contact.chatId)
            ) {
                return true;
            }

            if (
                item.person &&
                contact.name &&
                item.person.toLowerCase() ===
                contact.name.toLowerCase()
            ) {
                return true;
            }

            return false;
        });
    }

/*
 * Vista globale dell'agenda.
 *
 * Usata dall'owner e dalla CLI per interrogare
 * l'intero calendario, indipendentemente dal contatto.
 */
static getGlobal(options = {}) {

    const appointments = this.loadAll();

    const includeCompleted =
        options.includeCompleted === true;

    return appointments.filter(item => {

        if (!includeCompleted) {

            const status =
                String(item.status || "")
                    .toLowerCase();

            if (
                status === "cancelled" ||
                status === "completed"
            ) {
                return false;
            }
        }

        return true;
    });
}

static async buildCognitiveContext(message = {}) {

    const items = this.getGlobal();

    if (!items.length) {
        return [];
    }

    const now = Date.now();

    return items
        .map(item => {

            const eventTime =
                new Date(
                    `${item.date}T${item.time || "12:00:00"}`
                ).getTime();

            return {
                ...item,

                temporalDistance:
                    Number.isFinite(eventTime)
                        ? eventTime - now
                        : null
            };

        })
        .sort((a, b) => {

            const da =
                new Date(
                    `${a.date}T${a.time || "12:00:00"}`
                ).getTime();

            const db =
                new Date(
                    `${b.date}T${b.time || "12:00:00"}`
                ).getTime();

            return da - db;
        });
}
        /*
     * Costruisce il contesto agenda utilizzabile dal Brain.
     *
     * Regole:
     * - Console / CLI generica -> agenda globale
     * - contatto reale         -> eventi del contatto
     */
    static async buildContext(message = {}) {

        const chatId =
            String(
                message?.chatId ||
                message?.sender ||
                ""
            ).trim();

        const source =
            String(message?.source || "")
                .trim()
                .toLowerCase();

        const contactName =
            String(message?.contact?.name || "")
                .trim()
                .toLowerCase();

        const isConsole =
            chatId.toLowerCase() === "console";

        const isGenericCli =
            source === "cli" &&
            (
                !chatId ||
                isConsole ||
                contactName === "sconosciuto"
            );

        let items;

        if (isConsole || isGenericCli) {

            items = this.getGlobal();

        } else {

            items = this.getForContact(message);

        }

        if (!Array.isArray(items) || !items.length) {
            return [];
        }

        const now = Date.now();

        return items
            .map(item => {

                if (!item || !item.date) {
                    return null;
                }

                const time =
                    item.time ||
                    "12:00:00";

                const eventTime =
                    new Date(
                        `${item.date}T${time}`
                    ).getTime();

                return {
                    ...item,

                    temporalDistance:
                        Number.isFinite(eventTime)
                            ? eventTime - now
                            : null
                };

            })
            .filter(Boolean)
            .sort((a, b) => {

                const aTime =
                    new Date(
                        `${a.date}T${a.time || "12:00:00"}`
                    ).getTime();

                const bTime =
                    new Date(
                        `${b.date}T${b.time || "12:00:00"}`
                    ).getTime();

                if (
                    !Number.isFinite(aTime) &&
                    !Number.isFinite(bTime)
                ) {
                    return 0;
                }

                if (!Number.isFinite(aTime)) {
                    return 1;
                }

                if (!Number.isFinite(bTime)) {
                    return -1;
                }

                return aTime - bTime;
            });
    }

/*
 * Inserimento tramite linguaggio naturale.
 */
static async store(message) {

    console.log("📅 Agenda Engine");

    const event =
        await AgendaParser.parse(message);
console.log("");
console.log("========== EVENT ==========");
console.dir(event, { depth: null });
console.log("===========================");
console.log("");
    if (!event) {

        console.log(
            "⚠️ AgendaParser non ha riconosciuto un evento."
        );

        return (
            "Non sono riuscito ad interpretare " +
            "l'appuntamento."
        );

    }

    const appointment =
        this.add(event);

    console.log(
        "✅ Appuntamento registrato."
    );

    return appointment;

}

}

module.exports = AgendaEngine;
