const ConfigManager = require("./config/ConfigManager");

let contacts = {};

function load() {
    contacts = ConfigManager.contacts();
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
