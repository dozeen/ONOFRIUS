const state = require("./stateManager");

// =====================================================

const COMMANDS = {

    "#gordon on": state.MODES.AUTO,

    "#gordon auto": state.MODES.AUTO,

    "#gordon off": state.MODES.OFF,

    "#gordon manual": state.MODES.MANUAL,

    "#gordon observe": state.MODES.OBSERVE,

    "#gordon debug": state.MODES.DEBUG

};

// =====================================================

function parse(text = "") {

    text = text.trim().toLowerCase();

    if (!COMMANDS[text]) {

        return null;

    }

    return COMMANDS[text];

}

// =====================================================

function execute(text) {

    const mode = parse(text);

    if (!mode) {

        return false;

    }

    state.setMode(mode);

    return true;

}

// =====================================================

module.exports = {

    parse,

    execute

};
