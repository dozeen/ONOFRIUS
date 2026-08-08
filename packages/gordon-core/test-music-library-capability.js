/**
 * test-music-library-capability.js - Test di Esecuzione Deterministica della MusicLibraryCapability in Gordon3
 */

const MusicLibraryCapability = require("./capability/MusicLibraryCapability");

async function runTest() {
    console.log("=========================================");
    console.log("TEST MUSIC LIBRARY CAPABILITY");
    console.log("=========================================\n");

    const ctx1 = { text: "analizza i duplicati della musica" };
    const isQuery1 = MusicLibraryCapability.isMusicQuery(ctx1.text);
    const res1 = await MusicLibraryCapability.execute(ctx1);

    if (isQuery1 && res1.handled && ctx1.skipLLM && ctx1.response.includes("analyze-duplicates-v2.ps1")) {
        console.log("✅ TEST 1 PASSED: Query duplicati musica intercettata ed eseguita senza LLM.\n");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    const ctx2 = { text: "pulisci la libreria musicale" };
    const res2 = await MusicLibraryCapability.execute(ctx2);

    if (res2.handled && ctx2.response.includes("music-library-manager.ps1")) {
        console.log("✅ TEST 2 PASSED: Query pulizia libreria musicale intercettata ed eseguita correttamente.\n");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    console.log("🎉 ALL MUSIC LIBRARY CAPABILITY TESTS PASSED SUCCESSFULLY!");
}

runTest();
