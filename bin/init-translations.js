const path = require("path");
const fs = require("fs");

/*
const langs = [
    "ar",
    "de",
    "en",
    "es",
    "fa",
    "fr",
    "hi",
    "it",
    "ja",
    "pt",
    "ru",
    "ur",
    "zh"
];
 */

if (process.argv.length < 3) {
    console.error("ERROR: Provide an output directory");
    process.exit(1);
}

const outDir = path.resolve(process.argv[process.argv.length - 1]);

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

const outDirNoTrans = path.resolve(process.argv[process.argv.length - 1], "notranslate");
const outDirTrans = path.resolve(process.argv[process.argv.length - 1], "translate");
const outDirTransMod = path.resolve(process.argv[process.argv.length - 1], "translate", "modifications");
const outDirTransDefault = path.resolve(process.argv[process.argv.length - 1], "translate", "default");
const outDirTransModGen = path.resolve(process.argv[process.argv.length - 1], "translate", "modifications", "generated");
const outDirTransDefaultGen = path.resolve(process.argv[process.argv.length - 1], "translate", "default", "generated");

if (!fs.existsSync(outDirNoTrans)) {
    fs.mkdirSync(outDirNoTrans);
}
if (!fs.existsSync(outDirTrans)) {
    fs.mkdirSync(outDirTrans);
}
if (!fs.existsSync(outDirTransMod)) {
    fs.mkdirSync(outDirTransMod);
}
if (!fs.existsSync(outDirTransDefault)) {
    fs.mkdirSync(outDirTransDefault);
}
if (!fs.existsSync(outDirTransModGen)) {
    fs.mkdirSync(outDirTransModGen);
}
if (!fs.existsSync(outDirTransDefaultGen)) {
    fs.mkdirSync(outDirTransDefaultGen);
}

/*
langs.forEach((lang) => {
    const outFile = path.join(outDir, `${lang}.json`);
    if (!fs.existsSync(outFile)) {
        fs.writeFileSync(outFile, "{}");
        console.log(outFile);
    }
});
 */
