const path = require("path");
const fs = require("fs");
const glob = require("glob");

const srcPattern = path.resolve(
    __dirname,
    "..",
    "apps",
    "ui",
    "src",
    "**",
    "i18n",
    "*.json"
);

const pluginPattern = path.resolve(
    __dirname,
    "..",
    "libs",
    "**",
    "i18n",
    "*.json"
);
const outDir = path.resolve(path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n"));

const languages = {};

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// Merge all i8n files that aren't in the output directory
[srcPattern, pluginPattern].forEach((pattern) => {
    glob.sync(pattern)
        .filter((file) => !file.startsWith(outDir))
        .forEach((file) => {
            const baseName = path.basename(file);
            const langKeys = Object.keys(languages);
            if (!langKeys.includes(baseName)) {
                languages[baseName] = [];
            }
            languages[baseName].push(file);
        });
});

// Sort by path length, so the file tree is merged by depth
for (let langKey in languages) {
    const sortedLangFiles = languages[langKey].sort((a, b) => {
        return a.length - b.length
    });

    // Do merge
    let mergedLang = {};
    sortedLangFiles.forEach((file) => {
        const contents = fs.readFileSync(file).toString();
        try {
            const contentsJson = JSON.parse(contents);
            mergedLang = Object.assign(mergedLang, contentsJson);
        }
        catch (e) {
            throw `Invalid JSON at ${file}: ${e}`;
        }
    });

    // Write merged file
    const outFile = path.join(outDir, langKey);
    fs.writeFileSync(outFile, JSON.stringify(mergedLang));
    console.log(outFile);
}



