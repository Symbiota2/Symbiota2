const path = require("path");
const fs = require("fs");
const glob = require("glob");

const srcPattern = path.resolve(__dirname, "..", "apps", "ui", "src", "**", "i18n");
const srcDefaultPattern = path.resolve(srcPattern, "translate", "default", "*.json");
const srcDefaultGeneratedPattern = path.resolve(srcPattern, "translate", "default", "generated", "*.json");
const srcModificationsPattern = path.resolve(srcPattern, "translate", "modifications", "*.json");
const srcModificationsGeneratedPattern = path.resolve(srcPattern, "translate", "modifications", "generated", "*.json");
const srcNoTranslatePattern = path.resolve(srcPattern, "notranslate", "*.json");

const pluginPattern = path.resolve(__dirname, "..", "libs", "**", "i18n");
const pluginDefaultPattern = path.resolve(pluginPattern, "translate", "default", "*.json");
const pluginDefaultGeneratedPattern = path.resolve(pluginPattern, "translate", "default", "generated", "*.json");
const pluginModificationsPattern = path.resolve(pluginPattern, "translate", "modifications", "*.json");
const pluginModificationsGeneratedPattern = path.resolve(pluginPattern, "translate", "modifications", "generated", "*.json");
const pluginNoTranslatePattern = path.resolve(pluginPattern, "notranslate", "*.json");
const outDir = path.resolve(path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n"));

const languages = {};

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// Merge all i8n files that aren't in the output directory
[
    srcDefaultGeneratedPattern,
    srcDefaultPattern,
    pluginDefaultGeneratedPattern,
    pluginDefaultPattern,
    pluginModificationsGeneratedPattern,
    pluginModificationsPattern,
    srcModificationsPattern,
    srcNoTranslatePattern,
    pluginNoTranslatePattern
].forEach((pattern) => {
    glob.sync(pattern)
        .filter((file) => !file.startsWith(outDir))
        .forEach((file) => {
            // console.log("file is " + file + " " + path.basename(file))
            const baseName = path.basename(file);
            const langKeys = Object.keys(languages);
            if (!langKeys.includes(baseName)) {
                languages[baseName] = [];
            }
            languages[baseName].push(file);
        });
});

/*
for (let file in languages["en.json"]) {
    console.log(" english reading " + languages["en.json"][file])
}
 */

// Sort by path length, so the file tree is merged by depth
for (let langKey in languages) {

    /*
    const sortedLangFiles = languages[langKey].sort((a, b) => {
        return a.length - b.length
    });
     */

    // Do merge
    let mergedLang = {}
    let mergedReverseLookup = {}
    const langFiles = languages[langKey]
    langFiles.forEach((file) => {
        //console.log(" doing lang file is " + file )
        const contents = fs.readFileSync(file).toString();
        try {
            const contentsJSON = JSON.parse(contents);
            const keys = Object.keys(contentsJSON)
            for (let i = 0; i < keys.length; i++) {
                // console.log(keys[i] + " " + path.dirname(file))
                mergedReverseLookup[keys[i]] = path.dirname(file)
                //console.log(contestsJSON[keys[i]])
            }

            //for (let key in Object.keys(contents) {
            //    console.log(" k is " + k)
            //}


            mergedLang = Object.assign(mergedLang, contentsJSON);
        }
        catch (e) {
            throw `Invalid JSON at ${file}: ${e}`;
        }
    });

    //console.log(JSON.stringify(mergedReverseLookup))

    // Write merged file
    const outFile = path.join(outDir, langKey);
    const reverseFile = path.join(outDir, "reversed." + langKey)
    fs.writeFileSync(outFile, JSON.stringify(mergedLang));
    fs.writeFileSync(reverseFile, JSON.stringify(mergedReverseLookup))
    console.log(outFile);
    console.log(reverseFile);
}



