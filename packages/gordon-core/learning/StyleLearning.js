const fs = require("fs");
const path = require("path");

const FILE = path.join(
    __dirname,
    "../../memory/style/profile.json"
);

function load() {

    if (!fs.existsSync(FILE)) {

        return {

            messages: 0,

            words: {},

            emoji: {},

            openings: {},

            endings: {}

        };

    }

    return JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

}

function save(profile) {

    fs.mkdirSync(
        path.dirname(FILE),
        { recursive: true }
    );

    fs.writeFileSync(

        FILE,

        JSON.stringify(profile, null, 4)

    );

}

function add(map, key) {

    if (!key)
        return;

    map[key] ??= 0;

    map[key]++;

}

async function learn(text) {

    if (!text)
        return;

    const profile = load();

    profile.messages++;

    const words = text
        .toLowerCase()
        .split(/\s+/);

    words.forEach(word => {

        if (word.length > 2)

            add(profile.words, word);

    });

    const emojis = text.match(
        /\p{Extended_Pictographic}/gu
    ) || [];

    emojis.forEach(e =>

        add(profile.emoji, e)

    );

    const first = words.slice(0,2).join(" ");

    const last = words.slice(-2).join(" ");

    add(profile.openings, first);

    add(profile.endings, last);

    save(profile);

}

module.exports = {

    learn

};
