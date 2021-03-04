const path = require("path");
const fs = require("fs");

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

if (process.argv.length < 3) {
    console.error("ERROR: Provide an output directory");
    process.exit(1);
}

const outDir = path.resolve(process.argv[process.argv.length - 1]);

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

langs.forEach((lang) => {
    const outFile = path.join(outDir, `${lang}.json`);
    if (!fs.existsSync(outFile)) {
        fs.writeFileSync(outFile, "{}");
        console.log(outFile);
    }
});
