const WAIT_TIME = 3000;

const contacts = new Map();

function getContact(id) {

    if (!contacts.has(id)) {

        contacts.set(id, {

    busy: false,
    messages: [],
    timer: null,
    callback: null,

    version: 0

});

    }

    return contacts.get(id);

}

function enqueue(contactId, context, callback) {

    const contact = getContact(contactId);

    contact.version++;

    console.log(`📨 Versione ${contact.version}`);

    contact.callback = callback;

    contact.messages.push(context);


    clearTimeout(contact.timer);

    contact.timer = setTimeout(() => {

        process(contactId);

    }, WAIT_TIME);

}

async function process(contactId) {

    const contact = getContact(contactId);

    if (contact.busy)
        return;

    if (contact.messages.length === 0)
        return;

    contact.busy = true;

    const list = [...contact.messages];

    contact.messages = [];

    const merged = {

    ...list[0],

    conversationVersion: contact.version,

    text: list
        .map(x => x.text)
        .join("\n")

};

    console.log("");
    console.log("🧩 Conversation Scheduler");
    console.log("--------------------------------");
    console.log(merged.text);
    console.log("--------------------------------");

    try {

        await contact.callback(merged);

    } finally {

        contact.busy = false;

        if (contact.messages.length > 0) {

            console.log("📥 Nuovi messaggi in coda");

            setImmediate(() => process(contactId));

        }

    }

}

function getVersion(contactId) {

    return getContact(contactId).version;

}

module.exports = {

    enqueue,
    getVersion

};
