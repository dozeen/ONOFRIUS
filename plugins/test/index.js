module.exports = {

    name: "Test",

    priority: 50,

    async canHandle(context) {

        return context.text === "/test";

    },

    async handle() {

        return "Plugin TEST funzionante.";

    }

};
