// app.js

const kernel = require("./core/kernel");
const whatsapp = require("./adapters/whatsapp");

(async () => {

    await kernel.boot();

    await whatsapp.start();

})();
