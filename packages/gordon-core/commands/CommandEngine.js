const Policy = require("../policy/PolicyManager");
const Modes = require("../policy/PolicyModes");
const PolicyCommand = require("./commands/PolicyCommand");

async function execute(text) {

const cmd = text.trim().split(/\s+/);

if (cmd.length >= 2) {

    const action = cmd[0].toLowerCase();
    const target = cmd.slice(1).join(" ");

    switch (action) {

        case "off":

            Policy.set("contacts", target, Modes.OFF);
            console.log(`🔴 ${target} -> OFF`);
            return true;

        case "on":

            Policy.set("contacts", target, Modes.ON);
            console.log(`🟢 ${target} -> ON`);
            return true;

        case "listen":

            Policy.set("contacts", target, Modes.LISTEN);
            console.log(`👂 ${target} -> LISTEN`);
            return true;

    }

}
if (text.trim().toLowerCase() === "status") {

    console.log("");

    console.log("========== POLICIES ==========");

    console.log(
        JSON.stringify(
            Policy.list(),
            null,
            4
        )
    );

    console.log("");

    return true;

}
    if (await PolicyCommand.execute(text))
        return true;

    return false;

}

module.exports = {
    execute
};
