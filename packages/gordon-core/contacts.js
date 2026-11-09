const fs = require("fs");
const path = require("path");

const contactsFile = path.join(
    __dirname,
    "..",
    "config",
    "contacts.json"
);

let contacts = {};

function load() {

    contacts = JSON.parse(
        fs.readFileSync(contactsFile, "utf8")
    );

}

function get(number) {

    return contacts[number] || contacts.default;

}

function exists(number) {

    return !!contacts[number];

}

function all() {

    return contacts;

}

function reload() {

    load();

}

load();

module.exports = {

    get,
    exists,
    all,
    reload

};
