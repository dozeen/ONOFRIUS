const Banner = require("./setup/Banner");

const EnvironmentSetup = require("./setup/EnvironmentSetup");
const OwnerSetup = require("./setup/OwnerSetup");
const ContactsSetup = require("./setup/ContactsSetup");
const SettingsSetup = require("./setup/SettingsSetup");
const MemorySetup = require("./setup/MemorySetup");

async function main() {

    Banner.show();

    await EnvironmentSetup.run();

    await OwnerSetup.run();

    await ContactsSetup.run();

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

}

main();
