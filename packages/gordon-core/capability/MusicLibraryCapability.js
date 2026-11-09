/**
 * MusicLibraryCapability.js - Capability per la Gestione della Libreria Musicale e dei Duplicati in Gordon3
 */

class MusicLibraryCapability {
    static isMusicQuery(text = "") {
        if (!text || typeof text !== "string") return false;
        const lower = text.toLowerCase();

        return (
            lower.includes("duplicati musica") ||
            lower.includes("duplicati musicali") ||
            lower.includes("pulizia musica") ||
            lower.includes("libreria musicale") ||
            lower.includes("report musica") ||
            lower.includes("analyze-duplicates") ||
            (lower.includes("musica") && (lower.includes("pulisci") || lower.includes("analizza") || lower.includes("duplicati")))
        );
    }

    static async execute(context = {}) {
        const text = (context.text || (context.event && context.event.text) || "").toLowerCase();

        console.log("🎼 [MusicLibraryCapability] Intercettazione query libreria musicale...");

        let reply = "";

        if (text.includes("duplicati") || text.includes("analyze-duplicates")) {
            reply = "🎼 Sistema Gestione Musica (MD5 Duplicate Analyzer):\n\n" +
                    "• Script: analyze-duplicates-v2.ps1\n" +
                    "• Modalità consigliata: .\\analyze-duplicates-v2.ps1 -Path 'D:\\Musica' -AutoDelete -DryRun\n" +
                    "• Scansione: Calcolo Hash MD5 su oltre 3.800 file per identificare i veri duplicati binari.\n" +
                    "• Sicurezza: Mantiene la versione più risalente ed applica il Dry-Run prima della cancellazione.";
        } else if (text.includes("pulisci") || text.includes("clean")) {
            reply = "🎼 Sistema Manutenzione Libreria Musicale:\n\n" +
                    "• Script: music-library-manager.ps1\n" +
                    "• Comando: .\\music-library-manager.ps1 -Mode clean\n" +
                    "• Azione: Rimuove automaticamente file a 0-byte e cartelle vuote inutilizzate.";
        } else {
            reply = "🎼 Music Library Manager & Analyzer:\n\n" +
                    "• Comandi disponibili:\n" +
                    "  1. .\\analyze-duplicates-v2.ps1 - Scansione MD5 duplicati\n" +
                    "  2. .\\music-library-manager.ps1 -Mode analyze - Statistiche formati e file più grandi\n" +
                    "  3. MUSIC_CLEANUP_GUIDE.md - Guida operativa completa.";
        }

        context.response = reply;
        context.skipLLM = true;

        return {
            handled: true,
            reply: reply
        };
    }
}

module.exports = MusicLibraryCapability;
