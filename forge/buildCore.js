/**
 * buildCore.js - Forge Certified Builder per Gordon Core Package
 * Costruisce, sanitizza (Principio 9: Cognitivo ma non Personale) ed audita packages/gordon-core.
 */

const fs = require("fs");
const path = require("path");

const g3CoreDir = path.resolve(__dirname, "../../Gordon3/core");
const targetPkgDir = path.resolve(__dirname, "../packages/gordon-core");
const onofriusCoreDir = path.resolve(__dirname, "../core");

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

function sanitizeCodeAndPrompts(pkgDir) {
    console.log("🧹 SANITIZZAZIONE CODICE & PROMPT: Sostituzione riferimenti personali con astrazioni generiche...");

    // 1. Rimuovi file personali e specifici
    const filesToDelete = [
        path.join(pkgDir, "prompt/dollyDanceEvents.js"),
        path.join(pkgDir, "character/profiles/onofrio.js")
    ];
    for (const f of filesToDelete) {
        if (fs.existsSync(f)) {
            fs.rmSync(f, { force: true });
        }
    }

    // 2. Assicura profili di default puliti
    const charDir = path.join(pkgDir, "character/profiles");
    if (!fs.existsSync(charDir)) fs.mkdirSync(charDir, { recursive: true });

    const defaultProfileContent = `module.exports = {
    name: "Owner",
    systemPrompt: \`
Sei l'assistente cognitivo dell'Owner.

Parli nello stile naturale dell'Owner.

Regole:
- usa frasi corte
- parla in modo spontaneo
- evita frasi poetiche
- evita metafore
- evita linguaggio da intelligenza artificiale
- evita parole come:
  "destino"
  "universo"
  "anima gemella"
  "tempo che si ferma"

Quando scrivi:
- sii diretto
- usa ironia quando è naturale
- usa poche emoji
- non ripetere le stesse idee
- non scrivere paragrafi lunghi

Con i contatti familiari/fidati:
- rassicura
- sii affettuoso
- sii naturale
- non essere sdolcinato

Prima di rispondere chiediti:
"Questa frase la direbbe davvero l'Owner?"
\`
};
`;
    fs.writeFileSync(path.join(charDir, "default.js"), defaultProfileContent, "utf8");
    fs.writeFileSync(path.join(charDir, "ownerProfile.js"), defaultProfileContent, "utf8");

    // 3. Sanitizza characterEngine.js
    const charEngineFile = path.join(pkgDir, "character/characterEngine.js");
    if (fs.existsSync(charEngineFile)) {
        fs.writeFileSync(charEngineFile, `const ownerProfile = require("./profiles/default");

class CharacterEngine {
    build(message) {
        return ownerProfile;
    }
}

module.exports = new CharacterEngine();
`, "utf8");
    }

    // 4. Sanitizza policies.json
    const policyFile = path.join(pkgDir, "policy/policies.json");
    if (fs.existsSync(path.dirname(policyFile))) {
        fs.writeFileSync(policyFile, JSON.stringify({
            global: { mode: "on" },
            contacts: { default: { mode: "on" } },
            groups: {}
        }, null, 2), "utf8");
    }

    // 5. Copia componenti già sanificati da onofriusCoreDir se presenti
    const filesToSyncFromCore = [
        "config/ConfigManager.js",
        "identity/OwnerProfile.js",
        "personality/GordonStyle.js",
        "prompt/agenda.js",
        "prompt/rules.js",
        "prompt/character.js",
        "prompt/system.js",
        "prompt/PromptLoader.js",
        "privacy/FamilyPrivacyManager.js",
        "cognition/interaction/GroupDynamicsEngine.js",
        "cognition/interaction/InteractionEngine.js"
    ];

    for (const relPath of filesToSyncFromCore) {
        const srcPath = path.join(onofriusCoreDir, relPath);
        const dstPath = path.join(pkgDir, relPath);
        if (fs.existsSync(srcPath)) {
            const dstDir = path.dirname(dstPath);
            if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
            fs.copyFileSync(srcPath, dstPath);
        }
    }

    // 6. Scansione e sostituzione programmata in file chiave
    const replacements = [
        {
            file: path.join(pkgDir, "prompt/identity.js"),
            fn: (c) => `module.exports = function buildIdentityPrompt(context) {
    let ownerName = "l'Owner";
    try {
        const OwnerProfile = require("../identity/OwnerProfile");
        const owner = OwnerProfile.get();
        if (owner && owner.name) ownerName = owner.name;
    } catch (e) {}

    return \`========================
IDENTITÀ
========================
Sei il Cognitive Operating System dell'Owner. Scrivi esattamente come scriverebbe \${ownerName} su WhatsApp: calmo, diretto, spontaneo.
Scrivi poco (da 1 parola a 1 frase). Se la conversazione può chiudersi con 'Ok.' o 'Va bene.', fermati lì.\`.trim();
};
`
        },
        {
            file: path.join(pkgDir, "prompt/relationship.js"),
            fn: (c) => `module.exports = function buildRelationshipPrompt(context) {
    if (!context) return "";

    const contactName = context.contactName || context.senderName || "";
    const isOwner = !!context.isOwner;
    const isGroup = !!context.isGroup;

    let output = "========================\\nRELAZIONE\\n========================\\n";

    if (isOwner) {
        let ownerName = "Owner";
        try {
            const OwnerProfile = require("../identity/OwnerProfile");
            const owner = OwnerProfile.get();
            if (owner && owner.name) ownerName = owner.name;
        } catch (e) {}
        output += \`• INTERLOCUTORE: \${ownerName} (Owner del sistema).\\n• RAPPORTO: Massima confidenza e sintesi. Risposte dirette senza convenevoli.\`;
    } else if (isGroup) {
        output += \`• CONTESTO: Gruppo WhatsApp (\${context.chat?.name || "Gruppo"}).\\n• RAPPORTO: Partecipante calmo. Intervieni solo se pertinente.\`;
    } else if (contactName) {
        output += \`• INTERLOCUTORE: \${contactName}.\\n• RAPPORTO: Contatto conosciuto. Comunica in modo naturale, rispecchiando il suo tono.\`;
    } else {
        output += "• INTERLOCUTORE: Utente.\\n• RAPPORTO: Naturale e rispettoso.";
    }

    return output.trim();
};
`
        },
        {
            file: path.join(pkgDir, "prompt/style.js"),
            fn: (c) => c.replace(/ESEMPI CANONICI REALI DI ONOFRIO/g, "ESEMPI CANONICI REALI DELL'OWNER")
        },
        {
            file: path.join(pkgDir, "personality/GordonStyle.js"),
            fn: (c) => c.replace(/di Onofrio/gi, "dell'Owner").replace(/da Onofrio/gi, "dall'Owner")
        },
        {
            file: path.join(pkgDir, "personality/LinguisticConscience.js"),
            fn: (c) => c.replace(/Onofrio scriverebbe davvero/gi, "L'Owner scriverebbe davvero")
                        .replace(/contactName\.includes\("dolly"\)\s*\|\|\s*contactName\.includes\("silvana"\)\s*\|\|\s*contactName\.includes\("roberta"\)\s*\|\|\s*/gi, "")
        },
        {
            file: path.join(pkgDir, "personality/ToneEngine.js"),
            fn: (c) => {
                let res = c.replace(/contactName\.includes\("dolly"\)\s*\|\|\s*/g, "");
                res = res.replace(/\(es\.\s*Dolly\)/gi, "(es. partner)");
                res = res.replace(/Rispondi come scriverebbe Onofrio su WhatsApp/g, "Rispondi come scriverebbe l'Owner su WhatsApp");
                return res;
            }
        },
        {
            file: path.join(pkgDir, "brain/handlers/AgendaReasoningHandler.js"),
            fn: (c) => c.replace(/Onofrio ha stabilito/gi, "L'Owner ha stabilito")
                        .replace(/espresse da Onofrio/gi, "espresse dall'Owner")
        },
        {
            file: path.join(pkgDir, "brain/handlers/ResponseHandler.js"),
            fn: (c) => c.replace(/ONOFRIO VI CONTATTERÀ/g, "L'OWNER VI CONTATTERÀ").replace(/ONOFRIO VI CONTATTERA/g, "L'OWNER VI CONTATTERA")
        },
        {
            file: path.join(pkgDir, "capability/FileAgentCapability.js"),
            fn: (c) => c.replace(/per Onofrio/g, "per l'Owner")
        },
        {
            file: path.join(pkgDir, "capability/GordonPhotoCapability.js"),
            fn: (c) => c.replace(/GORDON_PHOTO_PATH\s*=\s*"[^"]*"/g, 'GORDON_PHOTO_PATH = path.join(process.cwd(), "assets", "Gordon.jpeg")')
        },
        {
            file: path.join(pkgDir, "cognition/facts/FactExtractor.js"),
            fn: (c) => {
                let res = c.replace(/Roberta \( mia figlia \)/g, "Alice ( mia figlia )")
                           .replace(/Silvana \( mia moglie \)/g, "Anna ( mia moglie )")
                           .replace('"Onofrio",', '"Owner",')
                           .replace('"Roberta",', '')
                           .replace('"Minervino",', '');
                return res;
            }
        },
        {
            file: path.join(pkgDir, "cognition/facts/ResponseSanitizer.js"),
            fn: (c) => {
                let res = c.replace(/\/Onofrio\\s\+scriverebbe\\s\+davvero\/i,/g, "/(Owner|Onofrius)\\s+scriverebbe\\s+davvero/i,");
                res = res.replace(/\/Onofrio\\s\+would\\s\+respond\/i,/g, "/(Owner|Onofrius)\\s+would\\s+respond/i,");
                res = res.replace(/\/NoIDEO\\s\+che\\s\+Onofrio\/i,/g, "/NoIDEO\\s+che\\s+(Owner|Onofrius)/i,");
                res = res.replace(/\/In\\s\+entrambi\\s\+i\\s\+casi,\\s\+Onofrio\/i,/g, "/In\\s+entrambi\\s+i\\s+casi,\\s+(Owner|Onofrius)/i,");
                res = res.replace(/onofrio potrebbe rispondere/gi, "l'owner potrebbe rispondere");
                return res;
            }
        },
        {
            file: path.join(pkgDir, "cognition/social/EmergentEventDetector.js"),
            fn: (c) => c.replace(/contattoc\|antonio\|pietro\|christian\|onofrio\|lucia\|silvana\|sabino/gi, 'contattoc|mario|luca|giulia|alex|anna|elena')
        },
        {
            file: path.join(pkgDir, "cognition/attention/AttentionEngineV2.js"),
            fn: (c) => c.replace(/Owner \/ Onofrio/g, "Owner")
        },
        {
            file: path.join(pkgDir, "cognition/InputClassifier.js"),
            fn: (c) => c.replace("imparare l'inglese", "imparare una lingua")
        },
        {
            file: path.join(pkgDir, "guard/CommercialGuard.js"),
            fn: (c) => c.replace(/Conferma economica riservata a Onofrio/g, "Conferma economica riservata all'Owner")
        },
        {
            file: path.join(pkgDir, "guard/CommercialPolicy.js"),
            fn: (c) => c.replace(/appartiene a Onofrio/g, "appartiene all'Owner").replace(/RISERVATE A ONOFRIO/g, "RISERVATE ALL'OWNER")
        },
        {
            file: path.join(pkgDir, "learning/StyleLearningEngine.js"),
            fn: (c) => c.replace(/di Onofrio/g, "dell'Owner").replace(/da Onofrio/g, "dall'Owner")
        },
        {
            file: path.join(pkgDir, "whisper.js"),
            fn: (c) => {
                let res = c.replace(/function resolvePythonBinary\(\)[\s\S]*?return "python3";\s*\}/m, `function resolvePythonBinary() {
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
}`);
                res = res.replace(/function resolveTranscribeScript\(\)[\s\S]*?return null;\s*\}/m, `function resolveTranscribeScript() {
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
}`);
                res = res.replace(/buf\.length > 100/g, "buf.length > 20");
                return res;
            }
        },
        {
            file: path.join(pkgDir, "perception/contextBuilder.js"),
            fn: (c) => {
                let res = c.replace(/id:\s*"393663580128@c\.us"/g, 'id: "owner@c.us"');
                res = res.replace(/require\("\.\.\/\.\.\/adapters\/whatsapp\/selfChat"\)/g, `(() => { try { return require("../../adapters/whatsapp/selfChat"); } catch(e) { return { isSelfChat: () => false }; } })()`);
                return res;
            }
        },
        {
            file: path.join(pkgDir, "cognition/CognitiveOrchestrator.js"),
            fn: (c) => {
                return c.replace(/require\("\.\.\/\.\.\/adapters\/whatsapp\/selfChat"\)/g, `(() => { try { return require("../../adapters/whatsapp/selfChat"); } catch(e) { return { isSelfChat: () => false }; } })()`);
            }
        },
        {
            file: path.join(pkgDir, "events/EventBuilder.js"),
            fn: (c) => {
                return c.replace(/require\("\.\.\/\.\.\/adapters\/whatsapp\/recentReplies"\)/g, `(() => { try { return require("../../adapters/whatsapp/recentReplies"); } catch(e) { return { isRecentReply: () => false }; } })()`);
            }
        },
        {
            file: path.join(pkgDir, "test-3-tier-narratives.js"),
            fn: (c) => c.replace(/"Onofrio ha inviato un messaggio su WhatsApp"/g, '"L\'Owner ha inviato un messaggio su WhatsApp"')
                        .replace(/"Onofrio", "ContattoA"/g, '"Owner", "ContattoA"')
                        .replace(/\bOnofrio\b/g, "Owner")
        },
        {
            file: path.join(pkgDir, "test-ambient-social-graph.js"),
            fn: (c) => c.replace(/"ContattoE", "Onofrio"/g, '"ContattoE", "Owner"')
        },
        {
            file: path.join(pkgDir, "test-social-intuition.js"),
            fn: (c) => c.replace(/l'autenticità di Onofrio/g, "l'autenticità dell'Owner")
        },
        {
            file: path.join(pkgDir, "test-style-learning.js"),
            fn: (c) => c.replace(/ESEMPI CANONICI REALI DI ONOFRIO/g, "ESEMPI CANONICI REALI DELL'OWNER")
        },
        {
            file: path.join(pkgDir, "test-agenda-intent-execution.js"),
            fn: (c) => {
                return c.replace(/try\s*\{\s*const fs = require\('fs'\);[\s\S]*?catch\(e\)\s*\{\}/g, "");
            }
        },
        {
            file: path.join(pkgDir, "test-learning-and-fact-extraction.js"),
            fn: (c) => c.replace(/Roberta/g, "Giulia").replace(/Minervino/g, "Milano")
        }
    ];

    for (const rep of replacements) {
        if (fs.existsSync(rep.file)) {
            try {
                const original = fs.readFileSync(rep.file, "utf8");
                const sanitized = rep.fn(original);
                fs.writeFileSync(rep.file, sanitized, "utf8");
            } catch (err) {
                console.error(`⚠️ Errore sanitizzazione file ${rep.file}:`, err.message);
            }
        }
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
        path.join(memoryDir, "tasks/tasks.json"),
        path.join(memoryDir, "social/ambientArchive.json"),
        path.join(memoryDir, "social/ambientEvents.json"),
        path.join(memoryDir, "social/ambientNarratives.json")
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
    fs.writeFileSync(path.join(configDir, "chatState.json"), JSON.stringify({ seenChats: [], mutedChats: [] }, null, 2), "utf8");
}

function auditPrinciple9(pkgDir) {
    console.log("🛡️ AUDIT PRINCIPIO 9 (Cognitivo ma non Personale)...");
    let violations = 0;
    const forbiddenTerms = ["Onofrio", "Dolly", "Silvana", "Roberta", "Manolo", "Cannone", "Inglese"];

    function checkDir(dir) {
        for (const item of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                if (item === "node_modules" || item === ".git") continue;
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
                if (item.endsWith(".json") || item.endsWith(".js") || item.endsWith(".md") || item.endsWith(".txt")) {
                    const content = fs.readFileSync(fullPath, "utf8");
                    for (const term of forbiddenTerms) {
                        const regex = new RegExp(`\\b${term}\\b`, 'i');
                        if (regex.test(content)) {
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

    // 1. Sanitizza codice, prompt e personalità
    sanitizeCodeAndPrompts(targetPkgDir);

    // 2. Sanitizza memoria e configurazioni personali
    sanitizeMemoryAndConfig(targetPkgDir);

    // 3. Genera package.json per gordon-core
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

    // 4. Esegui Audit del Principio 9 su TUTTI i file del pacchetto
    auditPrinciple9(targetPkgDir);

    console.log("🚀 FORGE CORE BUILDER COMPLETATO CON SUCCESSO!\n");
}

if (require.main === module) {
    buildCore();
}

module.exports = buildCore;
