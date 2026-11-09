const fs = require("fs");
const path = require("path");

const MEMORY_DIR = path.join(
    __dirname,
    "..",
    "memory"
);

if (!fs.existsSync(MEMORY_DIR))
    fs.mkdirSync(MEMORY_DIR);

function file(contact) {

    return path.join(
        MEMORY_DIR,
        `${contact}.json`
    );

}

function load(contact) {

    const f = file(contact);

    if (!fs.existsSync(f))
        return [];

    return JSON.parse(
        fs.readFileSync(f, "utf8")
    );

}

function save(contact, history) {

    fs.writeFileSync(
        file(contact),
        JSON.stringify(history, null, 2)
    );

}

function add(contact, role, text) {

    const history = load(contact);

    history.push({

        role,
        text,
        timestamp: Date.now()

    });

    // Conserva solo gli ultimi 30 messaggi
    while (history.length > 30)
        history.shift();

    save(contact, history);

}

module.exports = {

    load,
    add

};
