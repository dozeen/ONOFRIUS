const fs = require("fs");
const path = require("path");

const DIR = path.join(process.cwd(), "memory", "relationships");

function ensureDirectory() {

    if (!fs.existsSync(DIR)) {
        fs.mkdirSync(DIR, { recursive: true });
    }

}

function filename(phone) {
    return path.join(DIR, `${phone}.json`);
}

function load(phone) {

    ensureDirectory();

    const file = filename(phone);

    if (!fs.existsSync(file)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(file, "utf8"));

}

function save(phone, data) {

    ensureDirectory();

    fs.writeFileSync(
        filename(phone),
        JSON.stringify(data, null, 2)
    );

}

module.exports = {
    load,
    save
};
