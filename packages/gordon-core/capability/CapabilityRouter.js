const CapabilityRegistry = require("./CapabilityRegistry");
const AgendaCapability = require("./AgendaCapability");
const MusicLibraryCapability = require("./MusicLibraryCapability");
const FileAgentCapability = require("./FileAgentCapability");
const SystemInfoCapability = require("./SystemInfoCapability");
const GordonPhotoCapability = require("./GordonPhotoCapability");

class CapabilityRouter {
    constructor() {
        this.agendaCap = AgendaCapability;
        this.musicCap = MusicLibraryCapability;
        this.fileCap = FileAgentCapability;
        this.sysInfoCap = SystemInfoCapability;
        this.photoCap = GordonPhotoCapability;
    }

    async execute(context) {
        const text = context.text || (context.event && context.event.text) || "";

        // 0. Controllo foto ufficiale di Gordon
        if (this.photoCap.isPhotoQuery(text)) {
            const result = await this.photoCap.execute(context);
            if (result?.handled) return result;
        }

        // 1. Controllo deterministico per ora, data, identità e info sistema (Zero Allucinazioni)
        if (this.sysInfoCap.isSystemInfoQuery(text)) {
            const result = await this.sysInfoCap.execute(context);
            if (result?.handled) return result;
        }

        // 2. Controllo prioritario intent deterministico agenda (Solo per Owner / Console)
        if (context.isOwner && this.agendaCap.isAgendaQuery(text)) {
            const result = await this.agendaCap.execute(context);
            if (result?.handled) return result;
        }

        // 3. Controllo deterministico per la gestione della libreria musicale
        if (this.musicCap.isMusicQuery(text)) {
            const result = await this.musicCap.execute(context);
            if (result?.handled) return result;
        }

        // 4. Controllo deterministico per le operazioni su file system
        if (this.fileCap.isFileQuery(text)) {
            const result = await this.fileCap.execute(context);
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
