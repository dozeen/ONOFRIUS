class Builder {

    constructor() {

        this.steps = [];

    }

    add(name, fn) {

        this.steps.push({
            name,
            fn
        });

    }

    async run() {

        console.log("");

        for (const step of this.steps) {

            process.stdout.write("• " + step.name + " ... ");

            await step.fn();

            console.log("OK");

        }

        console.log("");

    }

}

module.exports = Builder;
