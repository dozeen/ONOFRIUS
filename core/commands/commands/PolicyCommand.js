const Policy = require("../../policy/PolicyManager");
const Modes = require("../../policy/PolicyModes");

async function execute(text) {

    text = text.trim();

    let m;

    // Disattiva Gordon per Andrea
    m = text.match(/^disattiva gordon per (.+)$/i);

    if (m) {

        const identity = m[1].trim();

        Policy.set(identity, Modes.OBSERVE);

        console.log(`✅ Gordon disattivato per ${identity}`);

        return true;

    }

    // Attiva Gordon per Andrea
    m = text.match(/^attiva gordon per (.+)$/i);

    if (m) {

        const identity = m[1].trim();

        Policy.set(identity, Modes.ASSIST);

        console.log(`✅ Gordon attivato per ${identity}`);

        return true;

    }

    // Metti Andrea in osservazione
    m = text.match(/^metti (.+) in osservazione$/i);

    if (m) {

        const identity = m[1].trim();

        Policy.set(identity, Modes.OBSERVE);

        console.log(`👁️ ${identity} è ora in modalità osservazione`);

        return true;

    }

    // Mostra policy
    if (/^mostra policy$/i.test(text)) {

        console.table(Policy.list());

        return true;

    }

    return false;

}

module.exports = {
    execute
};
