const Banner = require("./Banner");

const EnvironmentSetup = require("./EnvironmentSetup");
const OwnerSetup = require("./OwnerSetup");
const ContactsSetup = require("./ContactsSetup");
const IdentitySetup = require("./IdentitySetup");
const SettingsSetup = require("./SettingsSetup");
const MemorySetup = require("./MemorySetup");

module.exports = async function () {

    Banner.show();

    await EnvironmentSetup.run();
    await OwnerSetup.run();
    await ContactsSetup.run();
    await IdentitySetup.run();
    await SettingsSetup.run();
    await MemorySetup.run();

    console.log("");

    console.log("========================================");
    console.log("        ONOFRIUS READY");
    console.log("========================================");

    console.log("");

    console.log("Run:");

    console.log("");

    console.log("npm start");

    console.log("");

};
