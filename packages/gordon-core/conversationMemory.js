const conversations = new Map();

const MAX_MESSAGES = 20;

function add(contactId, role, text) {

    if (!text || !text.trim())
        return;

    if (!conversations.has(contactId))
        conversations.set(contactId, []);

    const history = conversations.get(contactId);

    history.push({
        role,
        text: text.trim()
    });

    while (history.length > MAX_MESSAGES)
        history.shift();

}

function get(contactId) {

    return conversations.get(contactId) || [];

}

module.exports = {

    add,
    get

};
