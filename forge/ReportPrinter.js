module.exports = {

    print(result) {

        console.log("");

        console.log("══════════════════════════════════════");

        console.log(result.name.toUpperCase());

        console.log("══════════════════════════════════════");

        console.log("");

        for (const item of result.critical) {

            console.log("❌", item.message);

            console.log("   File :", item.file);

            console.log("   Fix  :", item.action);

            console.log("");

        }

        for (const item of result.warnings) {

            console.log("⚠️", item.message);

            console.log("   File :", item.file);

            console.log("");

        }

        for (const item of result.infos) {

            console.log("ℹ️", item.message);

            console.log("   File :", item.file);

            console.log("");

        }

        console.log("Critical :", result.critical.length);

        console.log("Warnings :", result.warnings.length);

        console.log("");

    }

};
