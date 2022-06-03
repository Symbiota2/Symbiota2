/**
 * Usage: Input one or more folder names (max of 5) or 'all' out of the following supported translation folders
 * Options:
 * ui-plugin-collection
 * ui-plugin-image
 * ui-plugin-occurrence
 * ui-plugin-taxonomy
 * ui (which is the base ui app files)
 * all
 */

//Import libraries
const { Translate } = require('@google-cloud/translate').v2;

const path = require("path");
const fs = require("fs");
const glob = require("glob");

const srcPattern = path.resolve(__dirname, "..", "apps", "ui", "src", "**", "i18n")
const pluginPattern = path.resolve(__dirname, "..", "libs", "**", "i18n")
const symbiotaKey = fs.readFileSync(path.resolve(__dirname, "gCloudTranslateKey.txt")).toString('utf-8');
//Make sure you have the key file needed to use the API stored locally! Find it on GCloud.
//This allows us to use a generic API key instead of an application service account for authentication.
const translate = new Translate({ key: symbiotaKey });

// const targetLangPrefixes = getPrefixes()
const targetLangPrefixes = [
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

let patterns = []

if (process.argv.length < 3) {
    patterns = [srcPattern, pluginPattern]
} else {
    for (let i = 2; i < process.argv.length; i++) {
        const currDir = path.resolve(__dirname, "..", "libs", process.argv[i], "**", "i18n")
        //let currDir = langPathsObj[process.argv[i]]
        //if (currDir == undefined) {
        //    throw new Error("Please input a valid plugin directory name. Valid names: ui-plugin-collection, ui-plugin-image, ui-plugin-occurrence, ui-plugin-taxonomy, ui, all.");
        //}
        patterns.push(currDir);
    }
}

let fromPatterns = []
let appendPatterns = []
for (let pattern of patterns) {
    // console.log("patter is " + pattern)
    fromPatterns.push(path.resolve(pattern, "translate", "default", "*.json"))
    // modifiedPatterns.push(path.resolve(pattern, "translate", "default", "generated", "*.json"))
    appendPatterns.push(path.resolve(pattern, "translate", "modifications", "*.json"))
}

//Run the main script.
runTranslations(targetLangPrefixes, fromPatterns, false).catch(console.error)
runTranslations(targetLangPrefixes, appendPatterns, true).catch(console.error)

/*
function getPrefixes() {
    const targetLangPrefixes = []
    // Let's get the target languages
    const assetsDir = path.resolve(path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n", '**', '*.json'))
    glob.sync(assetsDir).forEach((file) => {
        const baseName = path.basename(file);
        const langPrefix = baseName.replace(".json", '')
        if (!targetLangPrefixes.includes(langPrefix)) {
            // console.log("prefix " + langPrefix)
            targetLangPrefixes.push(langPrefix);
        }
    })
    return targetLangPrefixes
}
 */

/**
 * Main runner function to refresh translation json files in the following directories:
 * libs/ui-plugin-collection/src/i18n
 * libs/ui-plugin-image/src/i18n
 * libs/ui-plugin-occurrence/src/i18n
 * libs/ui-plugin-taxonomy/src/i18n
 */
async function runTranslations(targetLangPrefixes, modifiedPatterns, doAppend) {
    const languages = {}

    // Sanity check, rule out generating any files in assests, probably don't need, but just in case
    const filterDir = path.resolve(path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n"))
    //modifiedPatterns.forEach((pattern) => {
    //    console.log(" pattern is " + pattern)
    //})
    modifiedPatterns.forEach((pattern) => {
        glob.sync(pattern)
            .filter((file) => !file.startsWith(filterDir))
            .forEach((file) => {
                const baseName = path.basename(file);
                const langKeys = Object.keys(languages);
                const langPrefix = baseName.replace(".json", '')
                // console.log("Path: ", path.dirname(file))
                // console.log("BaseName: ", baseName.toString())
                if (!langKeys.includes(langPrefix)) {
                    languages[langPrefix] = [];
                }
                languages[langPrefix].push(file);
                /*
                if (langPrefix != 'en' && !targetLangPrefixes.includes(langPrefix))
                    targetLangPrefixes.push(langPrefix);
                 */
            });
    });

    /*
    let enPaths = languages["en.json"];
    console.log("EnPaths: ", enPaths);
    console.log("TargetLangPrefixes: ", targetLangPrefixes);
     */


    for (let langName of Object.keys(languages)) {
        // console.log(" langName is " + langName)
        //Compare each language (file) to each other language file and translate
        for (let index = 0; index < languages[langName].length; index++) {
            let currPath = languages[langName][index];
            console.log("Translating using path " + langName + " " + currPath);
            //Parse the language json from which we are translating
            const contents = fs.readFileSync(currPath).toString();
            try {
                const contentsObj = JSON.parse(contents);
                //console.log("Calling translateJson with languages: ", languages);
                await translateJson(path.dirname(currPath), langName, contentsObj, targetLangPrefixes, doAppend);
                // throttling back limit
                // console.log("Waiting 1 second to limit rate of translation within Google API default limits.")
                // await delay(1000);
            }
            catch (e) {
                //console.log("Could not read json at path: ", currEnPath, " continuing to next directory.");
                //console.log(`Error: ${e}`);
                throw `Invalid JSON in main foreach: ${e}`;
            }
        }
    }

}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Runs the main logic for translating all jsons in a specific directory
 * @param {Object} enContents Object representing the en.json file in the directory
 * @param {Object} languages Object containing the json objects for all languages besides english
 * @param {Integer} jsonFileIndex Integer representing the current set of json files (the directory)
 */
async function translateJsonOld(enContents, languages, jsonFileIndex, targetLangPrefixes) {
    // Creates a client
    // console.log("path is " + path.resolve(__dirname, "gCloudTranslateKey.txt"))
    const symbiotaKey = fs.readFileSync(path.resolve(__dirname, "gCloudTranslateKey.txt")).toString('utf-8');
    //Make sure you have the key file needed to use the API stored locally! Find it on GCloud.
    //This allows us to use a generic API key instead of an application service account for authentication.
    const translate = new Translate({ key: symbiotaKey });
    const enKeys = Object.keys(enContents);
    let enVals = Object.values(enContents);
    const enValLength = enVals.length
    // console.log("Envals length", enValLength);
    for (let prefixIndex = 0; prefixIndex < targetLangPrefixes.length; prefixIndex++) {
        try {
            let langPrefix = targetLangPrefixes[prefixIndex];
            let langKey = langPrefix + ".json";
            //const targetContents = fs.readFileSync(languages[langKey][jsonFileIndex]).toString();
            //const contentsJson = JSON.parse(targetContents);
            //Translate to our target language, denoted by the current prefix.
            let langObj = {};
            //Note: this assumes the length of a json will not exceed 256
            let translations = []

            if (enValLength > 128) {
                let currIndex = 0
                while ((currIndex + 128) < enValLength) {
                    //Get the next 128 elements to send
                    let currEnVals = enVals.slice(currIndex, (currIndex + 127));
                    const currTranslations = await translateText(currEnVals, langPrefix, translate);
                    translations.push.apply(translations, currTranslations)
                    currIndex += 128
                }
                //We no longer have 128 elements to send, slice from here to length
                let finalEnVals = enVals.slice(currIndex, enValLength);
                const finalTranslations = await translateText(finalEnVals, langPrefix, translate);
                translations.push.apply(translations, finalTranslations);
            }

            else {
                translations = await translateText(enVals, langPrefix, translate);
            }

            //Once we get the resulting translations, add them to the json.
            let index = 0;
            const langFilePath = languages[langKey][jsonFileIndex];
            //console.log("TRANSLATIONS FOR PATH ", langFilePath, ": ", translations)
            translations.forEach(translatedVal => {
                langObj[enKeys[index]] = translatedVal;
                index++;
            })
            //Export to JSON string and then to json file
            //Passing 4 for the third parameter pretty prints.
            const langJSON = JSON.stringify(langObj, null, 4);
            fs.writeFileSync(langFilePath, langJSON, { flag: 'w' });
        }
        catch (e) {
            console.log("Translate json errored", e)
        }
    }
}

/**
 * Runs the main logic for translating all jsons in a specific directory
 * @param {Object} enContents Object representing the en.json file in the directory
 * @param {Object} languages Object containing the json objects for all languages besides english
 * @param {Integer} jsonFileIndex Integer representing the current set of json files (the directory)
 */
async function translateJson(outputPath, fromLanguage, contents, targetLangPrefixes, doAppend) {
    // Creates a client
    const alreadyAppended = {}

    const keys = Object.keys(contents);
    let values = Object.values(contents);
    // console.log("values length", values.length);
    for (let prefixIndex = 0; prefixIndex < targetLangPrefixes.length; prefixIndex++) {
        if (targetLangPrefixes[prefixIndex] == fromLanguage) {
            continue
        }
        try {
            let langPrefix = targetLangPrefixes[prefixIndex];
            let langKey = langPrefix + ".json";
            //const targetContents = fs.readFileSync(languages[langKey][jsonFileIndex]).toString();
            //const contentsJson = JSON.parse(targetContents);
            //Translate to our target language, denoted by the current prefix.
            let langObj = {};
            //Note: this assumes the length of a json will not exceed 256
            let translations = []

            if (values.length > 128) {
                // console.log("translating " + values.length)
                let currIndex = 0
                while ((currIndex + 128) < values.length) {
                    //Get the next 128 elements to send
                    let currentValues = values.slice(currIndex, (currIndex + 127));
                    const currTranslations = await translateText(fromLanguage, currentValues, langPrefix, translate);
                    translations.push.apply(translations, currTranslations)
                    currIndex += 128
                }
                //We no longer have 128 elements to send, slice from here to length
                let finalValues = values.slice(currIndex, values.length);
                const finalTranslations = await translateText(fromLanguage, finalValues, langPrefix, translate);
                translations.push.apply(translations, finalTranslations);
            }

            else {
                // console.log("translating values.length ")
                translations = await translateText(fromLanguage, values, langPrefix, translate);
            }

            //Once we get the resulting translations, add them to the json.
            let index = 0;
            //const langFilePath = languages[langKey][jsonFileIndex];
            //console.log("TRANSLATIONS FOR PATH ", langFilePath, ": ", translations)
            translations.forEach(translatedVal => {
                langObj[keys[index]] = translatedVal;
                index++;
            })
            //Export to JSON string and then to json file
            //Passing 4 for the third parameter pretty prints.
            const langJSON = JSON.stringify(langObj, null, 4);
            const fileName = path.resolve(outputPath, "generated", langPrefix + ".json")
            console.log("Translating to " + fileName)
            if (doAppend) {
                if (alreadyAppended.hasOwnProperty(fileName)) {
                    fs.writeFileSync(fileName, langJSON, { flag: 'as' });
                } else {
                    fs.writeFileSync(fileName, langJSON, { flag: 'w' });
                    alreadyAppended[fileName] = 1
                }
            } else {
                fs.writeFileSync(fileName, langJSON, { flag: 'w' });
            }
        }
        catch (e) {
            console.log("Translate json error ", e)
        }
    }
}

/**
 * Used to interface with the GCloud translate function.
 * @param {String or Array of Strings} text The text to translate
 * @param {String} target ISO-639-1 compliant language code parameters. View the list here https://cloud.google.com/translate/docs/languages
 * @param {Translate} translate Translate object used to access the GCloud services.
 * @returns
 */
async function translateText(fromLanguage, text, toLanguage, translate) {
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    // console.log("translating from " + fromLanguage + " to " + toLanguage)
    let [translations] = await translate.translate(text, {from: fromLanguage, to: toLanguage});
    //translations = Array.isArray(translations) ? translations : [translations];
    /*
    console.log('Translations:');
    translations.forEach((translation, i) => {
        console.log(`${text[i]} => (${toLanguage}) ${translation}`);
    });
     */
    return translations;
}
