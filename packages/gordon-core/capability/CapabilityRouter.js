const CapabilityRegistry = require("./CapabilityRegistry");
const AgendaCapability = require("./AgendaCapability");
const MusicLibraryCapability = require("./MusicLibraryCapability");

class CapabilityRouter {
    constructor() {
        this.agendaCap = AgendaCapability;
        this.musicCap = MusicLibraryCapability;
    }

    async execute(context) {
        const text = context.text || (context.event && context.event.text) || "";

        // 1. Controllo prioritario intent deterministico agenda (Zero LLM, Zero Allucinazioni)
        if (this.agendaCap.isAgendaQuery(text)) {
            const result = await this.agendaCap.execute(context);
            if (result?.handled) return result;
        }

        // 2. Controllo deterministico per la gestione della libreria musicale
        if (this.musicCap.isMusicQuery(text)) {
            const result = await this.musicCap.execute(context);
            if (result?.handled) return result;
        }

        const capability = context.classification?.primary;
        const engine = CapabilityRegistry.get(capability);

        if (engine && typeof engine.execute === "function") {
            const result = await engine.execute(context);
            if (result?.handled) return result;
        }

        return { handled: false };
    }
}

module.exports = new CapabilityRouter();
