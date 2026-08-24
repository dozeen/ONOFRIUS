const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const MAX_ATTEMPTS = 5;
const RETRY_DELAYS = [2000, 3000, 4000, 5000, 6000];

async function downloadWithRetry(msg) {
    let lastError = null;

    if (!msg) {
        console.error("❌ [Whisper] Messaggio nullo passato a downloadWithRetry");
        return null;
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(`[Whisper] 📥 Download media (tentativo ${attempt}/${MAX_ATTEMPTS})...`);

            // Prova a rinfrescare l'oggetto messaggio se il client è attivo per recuperare le chiavi di decrittazione
            let targetMsg = msg;
            if (msg.client && msg.id && msg.id._serialized && typeof msg.client.getMessageById === "function") {
                try {
                    const freshMsg = await msg.client.getMessageById(msg.id._serialized);
                    if (freshMsg) targetMsg = freshMsg;
                } catch (e) {
                    // Fallback all'oggetto msg originale
                }
            }

            const media = await targetMsg.downloadMedia();

            if (media && media.data && media.data.length > 0) {
                console.log(`[Whisper] ✅ Download media completato con successo (${media.data.length} bytes).`);
                return media;
            }

            console.log("[Whisper] ⚠️ Media vuoto o non ancora decrittografato, ritento...");
        } catch (err) {
            lastError = err;
            console.log(`[Whisper] ⚠️ Tentativo ${attempt} fallito: ${err.message || err}`);
        }

        if (attempt < MAX_ATTEMPTS) {
            const delay = RETRY_DELAYS[attempt - 1] || 3000;
            console.log(`[Whisper] ⏳ Attesa di ${delay}ms prima del prossimo tentativo...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }

    if (lastError) {
        console.error("❌ [Whisper] Download media fallito dopo", MAX_ATTEMPTS, "tentativi. Ultimo errore:", lastError.message || lastError);
    }

    return null;
}

async function transcribe(msg) {
    console.log("");
    console.log("🎤 Whisper Audio Transcriber");
    console.log("");
    console.log("type:", msg.type);
    console.log("hasMedia:", msg.hasMedia);

    // Aspetta che le chiavi media siano negoziate sul client WhatsApp Web
    await new Promise(r => setTimeout(r, 2000));

    const media = await downloadWithRetry(msg);

    if (!media) {
        console.log("❌ [Whisper] Nessun media disponibile. Trascrizione saltata.");
        return "";
    }

    const voiceDir = path.join(__dirname, "..", "tmp", "voice");
    if (!fs.existsSync(voiceDir)) {
        fs.mkdirSync(voiceDir, { recursive: true });
    }

    const filename = Date.now() + ".ogg";
    const filepath = path.join(voiceDir, filename);

    try {
        fs.writeFileSync(filepath, Buffer.from(media.data, "base64"));
    } catch (err) {
        console.error("❌ Scrittura file audio fallita:", err.message);
        return "";
    }

    return new Promise((resolve) => {
        const python = spawn(
            path.join(__dirname, "..", ".venv", "bin", "python"),
            [path.join(__dirname, "..", "python", "transcribe.py"), filepath]
        );

        let output = "";
        let errored = false;

        python.stdout.on("data", data => {
            output += data.toString();
        });

        python.stderr.on("data", data => {
            console.error("Whisper stderr:", data.toString());
        });

        python.on("error", err => {
            errored = true;
            console.error("❌ Impossibile avviare il processo Python:", err.message);
        });

        python.on("close", (code) => {
            fs.unlink(filepath, () => {});

            if (errored || code !== 0) {
                console.error(`❌ Trascrizione fallita (exit code ${code})`);
                resolve("");
                return;
            }

            console.log("");
            console.log("📝 Trascrizione Audio Completata:");
            console.log(output.trim());
            console.log("");
            resolve(output.trim());
        });
    });
}

module.exports = {
    transcribe
};
