const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

function createClient() {
    return new Client({
        authStrategy: new LocalAuth({
            clientId: process.env.WHATSAPP_CLIENT_ID || "onofrius"
        }),
        webVersionCache: {
            type: "remote",
            remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1018944883-alpha.html"
        },
        puppeteer: {
            headless: true,
            executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
            dumpio: false,
            protocolTimeout: 300000,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--disable-features=UseSkiaRenderer",
                "--no-first-run",
                "--no-zygote"
            ]
        }
    });
}

module.exports = createClient;
