function separator() {

    console.log("══════════════════════════════════════════════");

}

function event(title) {

    console.log("");
    separator();
    console.log(title);
    separator();

}

function message(context) {

    console.log("");

    separator();

    console.log("📨 NUOVO MESSAGGIO");

    console.log("");

    console.log("ID        :", context.id);

    console.log("FROM      :", context.sender);

    console.log("NAME      :", context.senderName);

    console.log("TYPE      :", context.type);

    console.log("TEXT      :", context.text);

    console.log("MEDIA     :", context.media.type);

    console.log("GROUP     :", context.isGroup);

    console.log("OWNER     :", context.isOwner);

    console.log("ROLE      :", context.role);

    separator();

    console.log("");

}

function error(title, err) {

    console.log("");

    separator();

    console.error(title);

    console.error(err);

    separator();

    console.log("");

}

module.exports = {

    event,

    message,

    error

};
