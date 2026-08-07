/**
 * buildCore.js - Forge Certified Builder per Gordon Core Package
 * Costruisce, sanitizza (Principio 9: Cognitivo ma non Personale) ed audita packages/gordon-core.
 */

const fs = require("fs");
const path = require("path");

const g3CoreDir = path.resolve(__dirname, "../../Gordon3/core");
const targetPkgDir = path.resolve(__dirname, "../packages/gordon-core");

function copyRecursive(src, dst) {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
        for (const item of fs.readdirSync(src)) {
            copyRecursive(path.join(src, item), path.join(dst, item));
        }
    } else {
        fs.copyFileSync(src, dst);
    }
}

function sanitizeMemoryAndConfig(pkgDir) {
    console.log("🧹 SANITIZZAZIONE PRINCIPIO 9: Rimozione di dati personali e cronologie...");

    const memoryDir = path.join(pkgDir, "memory");
    const configDir = path.join(pkgDir, "config");

    // 1. Rimuovi la cronologia WhatsApp / chat (.jsonl)
    const historyDir = path.join(memoryDir, "history");
    if (fs.existsSync(historyDir)) {
        fs.rmSync(historyDir, { recursive: true, force: true });
    }
    fs.mkdirSync(historyDir, { recursive: true });

    // 2. Rimuovi contatti salvati
    const contactsDir = path.join(memoryDir, "contacts");
    if (fs.existsSync(contactsDir)) {
        fs.rmSync(contactsDir, { recursive: true, force: true });
    }
    fs.mkdirSync(contactsDir, { recursive: true });

    // 3. Sostituisci i file di memoria con template vuoti ([])
    const emptyJsonFiles = [
        path.join(memoryDir, "knowledge/facts.json"),
        path.join(memoryDir, "knowledge/knowledge.json"),
        path.join(memoryDir, "intentions/intentions.json"),
        path.join(memoryDir, "preferences/preferences.json"),
        path.join(memoryDir, "notes/notes.json"),
        path.join(memoryDir, "appointments/appointments.json"),
        path.join(memoryDir, "appointments/appointments.before-google.json"),
        path.join(memoryDir, "events/events.json"),
        path.join(memoryDir, "tasks/tasks.json")
    ];

    for (const file of emptyJsonFiles) {
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(file, "[]", "utf8");
    }

    // 4. File di stile/profili e stato
    const profilesFile = path.join(memoryDir, "style/profiles.json");
    if (!fs.existsSync(path.dirname(profilesFile))) fs.mkdirSync(path.dirname(profilesFile), { recursive: true });
    fs.writeFileSync(profilesFile, "{}", "utf8");

    const stateFile = path.join(memoryDir, "consolidation/state.json");
    if (!fs.existsSync(path.dirname(stateFile))) fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    fs.writeFileSync(stateFile, "{}", "utf8");

    // 5. Sanitizza configurazioni personali in config/
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

    const genericContacts = {
        "owner": { "name": "Owner", "role": "owner", "personality": "default", "memory": "owner.json" },
        "contact_example": { "name": "Alex", "role": "friend", "personality": "friendly", "memory": "alex.json" }
    };
    fs.writeFileSync(path.join(configDir, "contacts.json"), JSON.stringify(genericContacts, null, 2), "utf8");

    const genericIdentities = {
        "1234567890": "owner",
        "9876543210": "contact_example"
    };
    fs.writeFileSync(path.join(configDir, "identities.json"), JSON.stringify(genericIdentities, null, 2), "utf8");

    fs.writeFileSync(path.join(configDir, "addressBook.json"), "[]", "utf8");
}

function auditPrinciple9(pkgDir) {
    console.log("🛡️ AUDIT PRINCIPIO 9 (Cognitivo ma non Personale)...");
    let violations = 0;
    const forbiddenTerms = ["Dolly", "Silvana", "Roberta", "Cannone", "Inglese"];

    function checkDir(dir) {
        for (const item of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                checkDir(fullPath);
            } else {
                if (item.endsWith(".jsonl")) {
                    console.error(`❌ VIOLAZIONE PRINCIPIO 9: Trovata cronologia (.jsonl) in ${path.relative(pkgDir, fullPath)}`);
                    violations++;
                }
                if (fullPath.includes("/memory/contacts/") && item.endsWith(".json")) {
                    console.error(`❌ VIOLAZIONE PRINCIPIO 9: Trovato contatto personale in ${path.relative(pkgDir, fullPath)}`);
                    violations++;
                }
                // Scansione termini riservati/personali nei file di configurazione
                if (fullPath.includes("/config/") && item.endsWith(".json")) {
                    const content = fs.readFileSync(fullPath, "utf8");
                    for (const term of forbiddenTerms) {
                        if (content.includes(term)) {
                            console.error(`❌ VIOLAZIONE PRINCIPIO 9: Trovato termine riservato '${term}' in ${path.relative(pkgDir, fullPath)}`);
                            violations++;
                        }
                    }
                }
            }
        }
    }

    checkDir(pkgDir);

    if (violations === 0) {
        console.log("✅ AUDIT PRINCIPIO 9 SUPERATO: Nessun dato personale, contatto o cronologia presente nel pacchetto.");
    } else {
        console.error(`❌ AUDIT PRINCIPIO 9 FALLITO: Rilevate ${violations} violazioni!`);
        process.exit(1);
    }
}

async function buildCore() {
    console.log("=========================================");
    console.log("🔨 FORGE CORE BUILDER: Packaging Gordon Core");
    console.log("=========================================");

    if (!fs.existsSync(g3CoreDir)) {
        console.error("❌ Cartella sorgente Gordon3/core non trovata:", g3CoreDir);
        process.exit(1);
    }

    if (fs.existsSync(targetPkgDir)) {
        fs.rmSync(targetPkgDir, { recursive: true, force: true });
    }

    console.log("📦 Copia del motore da Gordon3/core...");
    copyRecursive(g3CoreDir, targetPkgDir);

    // Sanitizza memoria e configurazioni personali
    sanitizeMemoryAndConfig(targetPkgDir);

    // Genera package.json per gordon-core
    const pkgJson = {
        name: "gordon-core",
        version: "1.0.0",
        description: "Certified Cognitive Engine for ONOFRIUS Cognitive OS",
        main: "index.js"
    };

    fs.writeFileSync(
        path.join(targetPkgDir, "package.json"),
        JSON.stringify(pkgJson, null, 2),
        "utf8"
    );

    // Esegui Audit del Principio 9
    auditPrinciple9(targetPkgDir);

    console.log("🚀 FORGE CORE BUILDER COMPLETATO CON SUCCESSO!\n");
}

if (require.main === module) {
    buildCore();
}

module.exports = buildCore;
