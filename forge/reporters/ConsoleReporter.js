class ConsoleReporter {

    title(text) {

        console.log("");
        console.log("══════════════════════════════════════");
        console.log(text);
        console.log("══════════════════════════════════════");
        console.log("");

    }

    audit(name) {

        process.stdout.write("• " + name + " ... ");

    }

    pass() {

        console.log("PASS");

    }

    fail() {

        console.log("FAIL");

    }

    warning(msg) {

        console.log("⚠ " + msg);

    }

    success(msg) {

        console.log("✅ " + msg);

    }

    error(msg) {

        console.log("❌ " + msg);

    }

}

module.exports = new ConsoleReporter();
