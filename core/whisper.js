const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const whatsappDecryptor = require("./whatsappDecryptor");

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 1500;
const LOG_FILE = path.join(__dirname, "..", "logs", "audio_transcription_audit.log");

function auditLog(msgId, sender, status, details) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [ID: ${msgId || "N/D"}] [FROM: ${sender || "N/D"}] [STATUS: ${status}] ${details}\n`;
    try {
        const logDir = path.dirname(LOG_FILE);
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        fs.appendFileSync(LOG_FILE, line, "utf8");
    } catch (e) {}
}

async function inspectMessageDiagnostic(msg) {
    console.log("🔍 [Whisper Diagnostica] Ispezione preliminare messaggio:");
    if (!msg) {
        console.error("  ❌ [Causa Fallimento] Oggetto 'msg' è null o undefined.");
        return false;
    }

    const msgId = msg.id ? (msg.id._serialized || msg.id.id) : "Sconosciuto";
    const sender = msg.from || "Sconosciuto";
    const msgType = msg.type || "N/D";
    const hasMedia = Boolean(msg.hasMedia);
    const mimetype = msg.mimetype || "N/D";
    const duration = msg.duration || "N/D";

    console.log(`  • ID Messaggio: ${msgId}`);
    console.log(`  • Mittente: ${sender}`);
    console.log(`  • Tipo Messaggio: ${msgType}`);
    console.log(`  • hasMedia: ${hasMedia}`);
    console.log(`  • Mimetype dichiarato: ${mimetype}`);
    console.log(`  • Durata dichiarata: ${duration}s`);

    if (!hasMedia && msgType !== "ptt" && msgType !== "audio") {
        console.error("  ❌ [Causa Fallimento] Il messaggio non è marcato come multimediale (hasMedia=false, type=" + msgType + ").");
        auditLog(msgId, sender, "FAILED_PRECHECK", `Messaggio non audio: hasMedia=${hasMedia}, type=${msgType}`);
        return false;
    }

    return true;
}

async function downloadWithRetry(msg) {
    let lastError = null;
    const msgId = msg.id ? (msg.id._serialized || msg.id.id) : "Sconosciuto";
    const sender = msg.from || "Sconosciuto";

    // 1. Tenta il download standard via Puppeteer / WhatsApp Web
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(`[Whisper] 📥 Download media via WhatsApp Web (tentativo ${attempt}/${MAX_ATTEMPTS})...`);
            
            let targetMsg = msg;
            if (attempt >= 2 && msg && msg.client && msg.id && msg.id._serialized) {
                try {
                    const reFetched = await msg.client.getMessageById(msg.id._serialized);
                    if (reFetched && reFetched.hasMedia) {
                        targetMsg = reFetched;
                    }
                } catch (refetchErr) {}
            }

            const media = await targetMsg.downloadMedia();

            if (media && media.data) {
                const buf = Buffer.from(media.data, "base64");
                if (buf.length > 20) {
                    console.log(`[Whisper] ✅ Download WhatsApp Web completato (${buf.length} bytes, mimetype: ${media.mimetype || "N/D"}).`);
                    return { media, buf, reason: "OK (Browser Decrypt)" };
                }
            } else {
                console.log(`[Whisper] ⚠️ Media non ancora decrittato dal browser, ritento...`);
            }
        } catch (err) {
            lastError = err;
            console.log(`[Whisper] ⚠️ Tentativo ${attempt} browser fallito: ${err.message || err}`);
        }

        if (attempt < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
        }
    }

    // 2. FALLBACK NATIVO: Se il browser fallisce, decritta direttamente i byte crittografati con HKDF + AES-CBC
    console.log("⚡ [Whisper] Attivazione Decrittazione Nativa Autonoma (HKDF + AES-CBC)...");

    let directPath = msg.directPath || (msg._data && (msg._data.directPath || msg._data.mediaData?.directPath || msg._data.deprecatedMms3Url));
    let mediaKey = msg.mediaKey || (msg._data && (msg._data.mediaKey || msg._data.mediaData?.mediaKey));
    let mimetype = msg.mimetype || (msg._data && (msg._data.mimetype || msg._data.mediaData?.mimetype));
    let msgType = msg.type || (msg._data && msg._data.type) || "ptt";

    // Se mediaKey e un Buffer o Uint8Array o oggetto con data array, converti in stringa base64
    if (Buffer.isBuffer(mediaKey)) {
        mediaKey = mediaKey.toString("base64");
    } else if (mediaKey && typeof mediaKey === "object" && mediaKey.data) {
        mediaKey = Buffer.from(mediaKey.data).toString("base64");
    }

    if ((!directPath || !mediaKey) && msg && msg.client && msg.client.pupPage && msg.id && msg.id._serialized) {
        try {
            console.log("  🔍 [Whisper] Recupero chiavi crittografiche (directPath, mediaKey) dallo Store...");
            const extracted = await msg.client.pupPage.evaluate(async (targetId) => {
                let m;
                try {
                    m = window.require("WAWebCollections")?.Msg?.get(targetId);
                } catch(e) {}
                if (!m && window.Store?.Msg?.get) {
                    try { m = window.Store.Msg.get(targetId); } catch(e) {}
                }
                if (!m) {
                    try {
                        const collections = window.require("WAWebCollections");
                        if (collections?.Msg?.models) {
                            const parts = (targetId || "").split("_");
                            const rawId = parts[parts.length - 1];
                            m = collections.Msg.models.find(x => x.id?._serialized === targetId || x.id?.id === rawId || (x.id?._serialized && x.id._serialized.endsWith(rawId)));
                        }
                    } catch(e) {}
                }
                if (!m && window.Store?.Msg?.models) {
                    try {
                        const parts = (targetId || "").split("_");
                        const rawId = parts[parts.length - 1];
                        m = window.Store.Msg.models.find(x => x.id?._serialized === targetId || x.id?.id === rawId || (x.id?._serialized && x.id._serialized.endsWith(rawId)));
                    } catch(e) {}
                }
                if (m) {
                    let key = m.mediaKey || m.mediaData?.mediaKey;
                    let keyBase64 = null;
                    if (typeof key === "string") {
                        keyBase64 = key;
                    } else if (key && (key instanceof Uint8Array || Array.isArray(key) || key.buffer)) {
                        let binary = "";
                        const bytes = new Uint8Array(key.buffer || key);
                        for (let i = 0; i < bytes.byteLength; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        keyBase64 = btoa(binary);
                    }
                    return {
                        directPath: m.directPath || m.mediaData?.directPath || m.deprecatedMms3Url,
                        mediaKey: keyBase64,
                        mimetype: m.mimetype || m.mediaData?.mimetype,
                        type: m.type
                    };
                }
                return null;
            }, msg.id._serialized);

            if (extracted) {
                directPath = directPath || extracted.directPath;
                mediaKey = mediaKey || extracted.mediaKey;
                mimetype = mimetype || extracted.mimetype;
                msgType = msgType || extracted.type;
                console.log(`  🔑 [Whisper] Chiavi crittografiche ottenute: directPath=${Boolean(directPath)}, mediaKey=${Boolean(mediaKey)}`);
            }
        } catch (evalErr) {
            console.log(`  ⚠️ [Whisper] Errore recupero chiavi da store: ${evalErr.message}`);
        }
    }

    if (directPath && mediaKey) {
        try {
            const decryptedBuf = await whatsappDecryptor.decryptWhatsAppMedia(directPath, mediaKey, msgType);
            if (decryptedBuf && decryptedBuf.length > 100) {
                console.log(`✅ [Whisper] Decrittazione diretta nativa riuscita (${decryptedBuf.length} bytes)!`);
                return {
                    media: {
                        data: decryptedBuf.toString("base64"),
                        mimetype: mimetype || "audio/ogg; codecs=opus"
                    },
                    buf: decryptedBuf,
                    reason: "OK (Direct Native Decrypt)"
                };
            }
        } catch (decErr) {
            console.error("❌ [Whisper] Decrittazione nativa fallita:", decErr.message);
            lastError = decErr;
        }
    } else {
        console.error("❌ [Whisper] Impossibile eseguire decrittazione nativa: chiavi non trovate.");
    }

    const finalErr = lastError ? (lastError.message || String(lastError)) : "Impossibile decrittare file multimediale";
    auditLog(msgId, sender, "FAILED_DOWNLOAD", finalErr);

    return { media: null, buf: null, reason: finalErr };
}

function resolvePythonBinary() {
    const candidateVenvs = [
        path.join(process.cwd(), ".venv", "bin", "python3"),
        path.join(process.cwd(), ".venv", "bin", "python"),
        path.join(__dirname, "..", ".venv", "bin", "python3"),
        path.join(__dirname, "..", ".venv", "bin", "python"),
        path.join(__dirname, "..", "..", ".venv", "bin", "python3"),
        path.join(__dirname, "..", "..", ".venv", "bin", "python"),
        process.env.VIRTUAL_ENV ? path.join(process.env.VIRTUAL_ENV, "bin", "python3") : null,
        process.env.VIRTUAL_ENV ? path.join(process.env.VIRTUAL_ENV, "bin", "python") : null
    ].filter(Boolean);

    for (const binPath of candidateVenvs) {
        try {
            if (fs.existsSync(binPath) && fs.statSync(binPath).isFile()) {
                return binPath;
            }
        } catch (_) {}
    }
    return "python3";
}

function resolveTranscribeScript() {
    const candidateScripts = [
        path.join(process.cwd(), "python", "transcribe.py"),
        path.join(__dirname, "..", "..", "python", "transcribe.py"),
        path.join(__dirname, "..", "python", "transcribe.py")
    ];

    for (const scriptPath of candidateScripts) {
        try {
            if (fs.existsSync(scriptPath) && fs.statSync(scriptPath).isFile()) {
                return scriptPath;
            }
        } catch (_) {}
    }
    return null;
}

function getAudioExtension(mimetype) {
    if (!mimetype) return ".ogg";
    const mime = mimetype.toLowerCase();
    if (mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac")) return ".m4a";
    if (mime.includes("mpeg") || mime.includes("mp3")) return ".mp3";
    if (mime.includes("wav")) return ".wav";
    if (mime.includes("webm")) return ".webm";
    return ".ogg";
}

async function transcribe(msg) {
    console.log("\n=========================================");
    console.log("🎤 [Whisper] Inizio Flusso Trascrizione Vocale");
    console.log("=========================================");

    const msgId = msg && msg.id ? (msg.id._serialized || msg.id.id) : "N/D";
    const sender = msg && msg.from ? msg.from : "N/D";

    const isInspectValid = await inspectMessageDiagnostic(msg);
    if (!isInspectValid) {
        return {
            status: "error",
            error_code: "INVALID_MESSAGE_PAYLOAD",
            reason: "Il messaggio ricevuto non è un audio valido o non contiene metadati media",
            transcript: "",
            segments: []
        };
    }

    await new Promise(r => setTimeout(r, 600));

    const downloaded = await downloadWithRetry(msg);

    if (!downloaded || !downloaded.media || !downloaded.buf) {
        const failureReason = downloaded ? downloaded.reason : "Buffer audio nullo";
        console.log(`❌ [Whisper] Trascrizione abortita: ${failureReason}`);
        return {
            status: "error",
            error_code: "MEDIA_DECRYPT_FAILED",
            reason: failureReason,
            transcript: "",
            segments: []
        };
    }

    const { media, buf } = downloaded;

    const archiveDir = path.join(__dirname, "..", "tmp", "voice_archive");
    if (!fs.existsSync(archiveDir)) {
        try {
            fs.mkdirSync(archiveDir, { recursive: true });
        } catch (dirErr) {
            console.error("❌ [Whisper] Impossibile creare directory voice_archive:", dirErr.message);
            auditLog(msgId, sender, "FAILED_FILESYSTEM", `Creazione voice_archive fallita: ${dirErr.message}`);
            return {
                status: "error",
                error_code: "FILESYSTEM_ERROR",
                reason: `Impossibile creare cartella archivio: ${dirErr.message}`,
                transcript: "",
                segments: []
            };
        }
    }

    const fileId = Date.now().toString();
    const ext = getAudioExtension(media.mimetype);
    const audioFilename = fileId + ext;
    const audioFilepath = path.join(archiveDir, audioFilename);
    const transcriptFilepath = path.join(archiveDir, fileId + ".txt");

    try {
        fs.writeFileSync(audioFilepath, buf);
        console.log(`[Whisper] 💾 File audio salvato ed archiviato con successo: ${audioFilepath} (${buf.length} bytes)`);
    } catch (err) {
        console.error("❌ [Whisper] Scrittura file audio su disco fallita:", err.message);
        auditLog(msgId, sender, "FAILED_WRITE", `Scrittura disco fallita: ${err.message}`);
        return {
            status: "error",
            error_code: "FILE_WRITE_ERROR",
            reason: `Scrittura file audio fallita: ${err.message}`,
            transcript: "",
            segments: []
        };
    }

    const pythonBin = resolvePythonBinary();
    const scriptPath = resolveTranscribeScript();

    if (!scriptPath) {
        console.error("❌ [Whisper] Script transcribe.py non trovato!");
        auditLog(msgId, sender, "FAILED_SCRIPT_NOT_FOUND", "transcribe.py non trovato nel sistema");
        return {
            status: "error",
            error_code: "TRANSCRIBE_SCRIPT_MISSING",
            reason: "Script Python transcribe.py non trovato",
            transcript: "",
            segments: []
        };
    }

    console.log(`[Whisper] 🐍 Esecuzione faster-whisper: ${pythonBin} ${scriptPath} ${audioFilepath}`);
    const startTime = Date.now();

    return new Promise((resolve) => {
        const python = spawn(pythonBin, [scriptPath, audioFilepath]);

        let output = "";
        let stderrOutput = "";
        let errored = false;

        python.stdout.on("data", data => {
            output += data.toString();
        });

        python.stderr.on("data", data => {
            const str = data.toString();
            stderrOutput += str;
            console.error("[Whisper Stderr]:", str.trim());
        });

        python.on("error", err => {
            errored = true;
            console.error("❌ [Whisper] Impossibile avviare il processo Python:", err.message);
            auditLog(msgId, sender, "FAILED_SPAWN", `Impossibile avviare Python: ${err.message}`);
            resolve({
                status: "error",
                error_code: "PYTHON_SPAWN_ERROR",
                reason: `Impossibile avviare interprete Python: ${err.message}`,
                transcript: "",
                segments: []
            });
        });

        python.on("close", (code) => {
            const elapsed = Date.now() - startTime;

            if (errored || code !== 0) {
                console.error(`❌ [Whisper] Trascrizione fallita (exit code ${code}) dopo ${elapsed}ms. Stderr: ${stderrOutput.trim()}`);
                auditLog(msgId, sender, "FAILED_WHISPER_EXEC", `Exit code ${code} dopo ${elapsed}ms. Stderr: ${stderrOutput.trim().slice(0, 200)}`);
                resolve({
                    status: "error",
                    error_code: "WHISPER_EXEC_ERROR",
                    reason: `Processo di trascrizione uscito con codice ${code}. Dettaglio: ${stderrOutput.trim()}`,
                    transcript: "",
                    segments: []
                });
                return;
            }

            let parsed = null;
            try {
                parsed = JSON.parse(output.trim());
            } catch (e) {
                parsed = { status: "success", transcript: output.trim(), segments: [] };
            }

            if (parsed && parsed.status === "error") {
                console.error(`❌ [Whisper] Errore segnalato da transcribe.py: ${parsed.error || parsed.reason}`);
                auditLog(msgId, sender, "FAILED_TRANSCRIBE_PY", `Errore script: ${parsed.error || parsed.reason}`);
                resolve({
                    status: "error",
                    error_code: parsed.error_code || "TRANSCRIBE_INTERNAL_ERROR",
                    reason: parsed.error || parsed.reason,
                    transcript: "",
                    segments: []
                });
                return;
            }

            const transcript = parsed.transcript || "";
            if (transcript) {
                try {
                    fs.writeFileSync(transcriptFilepath, transcript, "utf8");
                } catch (e) {}
            }

            console.log(`✅ [Whisper] Trascrizione completata con successo in ${elapsed}ms: "${transcript}"`);
            auditLog(msgId, sender, "SUCCESS", `Trascritto in ${elapsed}ms (${parsed.duration || 0}s audio): "${transcript.slice(0, 60)}..."`);

            resolve({
                status: "success",
                transcript: transcript,
                language: parsed.language || "it",
                duration: parsed.duration || 0,
                segments: parsed.segments || [],
                originalFile: audioFilepath,
                transcriptFile: transcriptFilepath,
                elapsedMs: elapsed
            });
        });
    });
}

module.exports = {
    transcribe
};
