const fs = require("fs");
const path = require("path");

class ModuleLoader {

    static load(directory) {

        const modules = [];

        const dir = path.resolve(directory);

        if (!fs.existsSync(dir))
            return modules;

        const entries = fs.readdirSync(dir).sort();
console.log(`📂 Loader: ${dir}`);
console.log(entries);
        for (const entry of entries) {

            const full = path.join(dir, entry);

            try {

                const stat = fs.statSync(full);

                // file .js
                if (stat.isFile()) {

                    if (!entry.endsWith(".js"))
                        continue;

                    if (entry.startsWith("_"))
                        continue;
console.log(`📦 Carico file: ${full}`);
                    const mod = require(full);

                    mod.__filename = entry;

                    modules.push(mod);
console.log(`✅ Caricato: ${entry}`);
                }

                // cartella con index.js
                else if (stat.isDirectory()) {

                    const index = path.join(full, "index.js");

                    if (!fs.existsSync(index))
                        continue;

                    const mod = require(index);

                    mod.__filename = entry;

                    modules.push(mod);

                }

            }

            catch (err) {

console.error(`❌ Errore caricando ${full}`);
console.error(err.stack);
            }

        }

        return modules;

    }

}

module.exports = ModuleLoader;
