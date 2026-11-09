// =====================================================
// Gordon State Manager
// =====================================================

const MODES = {

    AUTO: "AUTO",
    MANUAL: "MANUAL",
    OBSERVE: "OBSERVE",
    DEBUG: "DEBUG",
    OFF: "OFF"

};

const state = {

    mode: MODES.AUTO,
    since: Date.now()

};

// =====================================================

function setMode(mode) {

    if (!Object.values(MODES).includes(mode)) {

        throw new Error(`Modalità sconosciuta: ${mode}`);

    }

    state.mode = mode;
    state.since = Date.now();

    console.log("");
    console.log("🧠 Gordon Mode:", mode);
    console.log("");

}

// =====================================================

function getMode() {

    return state.mode;

}

// =====================================================

function getStatus() {

    return {

        mode: state.mode,
        since: state.since

    };

}

// =====================================================

function isAuto() {

    return state.mode === MODES.AUTO;

}

function isManual() {

    return state.mode === MODES.MANUAL;

}

function isObserve() {

    return state.mode === MODES.OBSERVE;

}

function isDebug() {

    return state.mode === MODES.DEBUG;

}

function isOff() {

    return state.mode === MODES.OFF;

}

// =====================================================

module.exports = {

    MODES,

    setMode,

    getMode,

    getStatus,

    isAuto,

    isManual,

    isObserve,

    isDebug,

    isOff

};
