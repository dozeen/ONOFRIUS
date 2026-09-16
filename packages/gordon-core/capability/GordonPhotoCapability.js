/**
 * GordonPhotoCapability.js - Capabilità deterministica per l'invio della foto ufficiale di Gordon
 */

const fs = require("fs");
const path = require("path");

class GordonPhotoCapability {
    static GORDON_PHOTO_PATH = path.join(process.cwd(), "assets", "Gordon.jpeg");

    static isPhotoQuery(text) {
        if (!text || typeof text !== "string") return false;
        const lower = text.toLowerCase().trim();
        const photoKeywords = [
            "foto", "immagine", "fotografia", "faccia", "aspettativa", "ritratto", "profilo", "come sei fatto", "come sei", "mostrami", "mandami la foto", "mandami una foto", "inviami la foto", "inviami una foto", "tua foto", "foto di gordon"
        ];
        
        const mentionsPhoto = photoKeywords.some(kw => lower.includes(kw));
        const mentionsGordonOrSelf = lower.includes("gordon") || lower.includes("tua") || lower.includes("tuo") || lower.includes("ti") || lower.includes("sei") || lower.includes("tu");

        return mentionsPhoto && mentionsGordonOrSelf;
    }

    static async execute(context) {
        const text = context.text || (context.event && context.event.text) || "";

        if (!this.isPhotoQuery(text)) {
            return { handled: false };
        }

        console.log("📸 [GordonPhotoCapability] Richiesta foto di Gordon rilevata!");

        if (fs.existsSync(this.GORDON_PHOTO_PATH)) {
            context.sendMediaFilePath = this.GORDON_PHOTO_PATH;
            context.response = "Eccomi! 😏";
            context.skipLLM = true;
            return {
                handled: true,
                sendMediaFilePath: this.GORDON_PHOTO_PATH,
                response: context.response,
                reply: context.response
            };
        } else {
            console.error(`❌ [GordonPhotoCapability] File foto non trovato in ${this.GORDON_PHOTO_PATH}`);
            return { handled: false };
        }
    }
}

module.exports = GordonPhotoCapability;
