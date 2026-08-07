/**
 * buildCore.js - Forge Certified Builder per Gordon Core Package
 * Costruisce, audita e certifica packages/gordon-core per la distribuzione in ONOFRIUS.
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

    console.log("📦 Copia dell'albero cognitivo da Gordon3/core...");
    copyRecursive(g3CoreDir, targetPkgDir);

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

    console.log("🔍 Audit dei require interni...");
    let issuesFound = 0;

    function auditDirectory(dir) {
        for (const item of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                auditDirectory(fullPath);
            } else if (item.endswith && item.endswith(".js") || item.endsWith(".js")) {
                const content = fs.readFileSync(fullPath, "utf8");
                if (content.includes('require("../../Gordon3') || content.includes('require("../../../memory') || content.includes('require("../../memory')) {
                    // Check if it's pointing out of package
                    const lines = content.split("\n");
                    lines.forEach((line, idx) => {
                        if (line.includes("require") && (line.includes("../../Gordon3") || line.includes("../../../memory"))) {
                            console.warn(`⚠️ Out-of-package require in ${path.relative(targetPkgDir, fullPath)}:${idx + 1}: ${line.trim()}`);
                            issuesFound++;
                        }
                    });
                }
            }
        }
    }

    auditDirectory(targetPkgDir);

    if (issuesFound === 0) {
        console.log("✅ AUDIT FORGE COMPLETATO: Nessun require fuori pacchetto rilevato.");
    } else {
        console.warn(`⚠️ AUDIT FORGE: Rilevati ${issuesFound} possibili require esterni.`);
    }

    console.log("🚀 FORGE CORE BUILDER COMPLETATO CON SUCCESSO!\n");
}

if (require.main === module) {
    buildCore();
}

module.exports = buildCore;
