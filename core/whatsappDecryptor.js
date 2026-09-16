/**
 * whatsappDecryptor.js - Decrittatore Diretto WhatsApp Media
 * Scarica e decritta i file audio/media WhatsApp tramite standard crittografico WhatsApp (HKDF + AES-CBC-256)
 * senza dipendere dai moduli JavaScript variabili di WhatsApp Web nel browser.
 */

const crypto = require("crypto");
const https = require("https");
const http = require("http");

const MEDIA_HKDF_INFO = {
    audio: "WhatsApp Audio Keys",
    ptt: "WhatsApp Audio Keys",
    image: "WhatsApp Image Keys",
    video: "WhatsApp Video Keys",
    document: "WhatsApp Document Keys",
    sticker: "WhatsApp Image Keys"
};

function getMediaKeys(mediaKey, type = "ptt") {
    const mediaKeyBuffer = typeof mediaKey === "string" ? Buffer.from(mediaKey, "base64") : mediaKey;
    const info = MEDIA_HKDF_INFO[type] || "WhatsApp Audio Keys";
    const salt = Buffer.alloc(32);
    const hkdfRaw = crypto.hkdfSync("sha256", mediaKeyBuffer, salt, Buffer.from(info, "utf-8"), 112);
    const hkdf = Buffer.from(hkdfRaw);
    return {
        iv: hkdf.subarray(0, 16),
        cipherKey: hkdf.subarray(16, 48),
        macKey: hkdf.subarray(48, 80),
        refKey: hkdf.subarray(80, 112)
    };
}

async function fetchBuffer(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("http:") ? http : https;
        const req = client.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchBuffer(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP status ${res.statusCode} per URL: ${url}`));
            }
            const chunks = [];
            res.on("data", chunk => chunks.push(chunk));
            res.on("end", () => resolve(Buffer.concat(chunks)));
        });
        req.on("error", reject);
        req.setTimeout(20000, () => {
            req.destroy();
            reject(new Error("Timeout download media cifrato"));
        });
    });
}

async function decryptWhatsAppMedia(directPath, mediaKey, type = "ptt") {
    if (!directPath || !mediaKey) {
        throw new Error("directPath o mediaKey mancanti");
    }

    let url = directPath;
    if (!url.startsWith("http")) {
        url = `https://mmg.whatsapp.net${directPath.startsWith("/") ? "" : "/"}${directPath}`;
    }

    console.log(`  🔐 [WhatsAppDecryptor] Download payload cifrato da CDN: ${url.slice(0, 60)}...`);
    const encryptedBuffer = await fetchBuffer(url);

    if (encryptedBuffer.length <= 10) {
        throw new Error(`Buffer cifrato troppo piccolo (${encryptedBuffer.length} bytes)`);
    }

    console.log(`  🔐 [WhatsAppDecryptor] Decrittazione AES-256-CBC (${encryptedBuffer.length} bytes)...`);
    const { iv, cipherKey } = getMediaKeys(mediaKey, type);

    // WhatsApp cifra con AES-CBC-256. Gli ultimi 10 byte sono il MAC di autenticazione.
    const ciphertext = encryptedBuffer.subarray(0, encryptedBuffer.length - 10);
    const decipher = crypto.createDecipheriv("aes-256-cbc", cipherKey, iv);
    decipher.setAutoPadding(true);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    console.log(`  ✅ [WhatsAppDecryptor] Decrittazione riuscita! Audio chiaro: ${decrypted.length} bytes.`);
    return decrypted;
}

module.exports = {
    decryptWhatsAppMedia,
    getMediaKeys
};
