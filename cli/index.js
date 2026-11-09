const command = process.argv[2];

const commands = {

    demo: "./commands/demo",

    info: "./commands/info",

    constitution: "./commands/constitution",

    explain: "./commands/explain",

    forge: "../forge/Forge"

};

if (!commands[command]) {

    console.log("");

    console.log("ONOFRIUS CLI");

    console.log("");

    console.log("Available commands:");

    Object.keys(commands).forEach(c =>

        console.log("  " + c)

    );

    process.exit(0);

}

require(commands[command]);
