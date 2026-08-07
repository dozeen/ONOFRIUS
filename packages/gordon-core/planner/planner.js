class Planner {

    plan(message) {

        const text =
            (message.text || "").toLowerCase();

        if (

            text.includes("cosa ti ho scritto prima") ||
            text.includes("ricordi") ||
            text.includes("ti ricordi")

        ) {

            return {

                goal: "remember",

                priority: 100

            };

        }

        if (

            text.includes("chi è") ||
            text.includes("chi sono")

        ) {

            return {

                goal: "knowledge",

                priority: 80

            };

        }

        return {

            goal: "chat",

            priority: 10

        };

    }

}

module.exports = Planner;
