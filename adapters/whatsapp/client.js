const { Client, LocalAuth } = require("whatsapp-web.js");

function createClient() {

    return new Client({

        authStrategy: new LocalAuth({

            clientId: "gordon3"

        }),

        webVersionCache: {

            type: "local"

        },

        puppeteer: {

            headless: true,

            executablePath: "/usr/bin/google-chrome",

            protocolTimeout: 300000,

            args: [

                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"

            ]

        }

    });

}

module.exports = createClient;
