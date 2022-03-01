//Import libraries
const { Translate } = require('@google-cloud/translate').v2;

const path = require("path");
const fs = require("fs");
const glob = require("glob");

//Run the main script.
runTranslations();

/**
 * Main runner function to refresh translation json files in the following directories:
 * libs/ui-plugin-collection/src/i18n
 * libs/ui-plugin-image/src/i18n
 * libs/ui-plugin-occurrence/src/i18n
 * libs/ui-plugin-taxonomy/src/i18n
 */
async function runTranslations() {
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

  const languages = {};
  const outDir = path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n");
  //There was a json in ui-common that only had an english translation, so it was breaking the script.
  const extraEnDir = path.resolve(__dirname, "..", "libs", "ui-common")
  const outDirApps = path.resolve(__dirname, "..", "apps");

  //Builds the object representing all the language json files.
  [srcPattern, pluginPattern].forEach((pattern) => {
    glob.sync(pattern)
      .filter((file) => !file.startsWith(outDirApps))
      .filter((file) => !file.startsWith(extraEnDir))
      .forEach((file) => {
        const baseName = path.basename(file);
        const langKeys = Object.keys(languages);
        //console.log("Path: ", path.dirname(file))
        //console.log("BaseName: ", baseName.toString())
        if (!langKeys.includes(baseName)) {
          languages[baseName] = [];
        }
        languages[baseName].push(file);
      });
  });

  let enPaths = languages["en.json"];
  //console.log("EnPaths: ", enPaths);

  //Compare each english path (file) to each other language file and translate
  for (let index = 0; index < enPaths.length; index++) {
    let currEnPath = enPaths[index];
    console.log("Translating using en path ", index, currEnPath);
    //Parse the english Json
    const contents = fs.readFileSync(currEnPath).toString();
    //console.log("Contents: ", contents)
    try {
      const enContentsObj = JSON.parse(contents);
      //console.log("Calling translateJson with languages: ", languages);
      await translateJson(enContentsObj, languages, index)
    }
    catch (e) {
      //console.log("Could not read json at path: ", currEnPath, " continuing to next directory.");
      //console.log(`Error: ${e}`);
      throw `Invalid JSON in main foreach: ${e}`;
    }
    index++;
  }
}

/**
 * Runs the main logic for translating all jsons in a specific directory
 * @param {Object} enContents Object representing the en.json file in the directory 
 * @param {Object} languages Object containing the json objects for all languages besides english
 * @param {Integer} jsonFileIndex Integer representing the current set of json files (the directory) 
 */
async function translateJson(enContents, languages, jsonFileIndex) {
  // Creates a client
  const symbiotaKey = fs.readFileSync("cloudKey.txt").toString('utf-8');
  //Make sure you have the key file needed to use the API stored locally! Find it on GCloud.
  //This allows us to use a generic API key instead of an application service account for authentication.
  const translate = new Translate({ key: symbiotaKey });

  //Parse the english Json
  const targetLangPrefixes = ['ar', 'de', 'es', 'fa', 'fr', 'hi', 'it', 'ja', 'pt', 'ru', 'ur', 'zh'];
  const enKeys = Object.keys(enContents);
  let enVals = Object.values(enContents);

  for (let prefixIndex = 0; prefixIndex < targetLangPrefixes.length; prefixIndex++) {
    try {
      let langPrefix = targetLangPrefixes[prefixIndex];
      let langKey = langPrefix + ".json";
      //const targetContents = fs.readFileSync(languages[langKey][jsonFileIndex]).toString();
      //const contentsJson = JSON.parse(targetContents);
      //Translate to our target language, denoted by the current prefix.
      let langObj = {};
      const translations = await translateText(enVals, langPrefix, translate);
      //Once we get the resulting translations, add them to the json.
      let index = 0;
      const langFilePath = languages[langKey][jsonFileIndex];
      translations.forEach(translatedVal => {
        langObj[enKeys[index]] = translatedVal;
        index++;
      })
      //Export to JSON string and then to json file
      //Passing 4 for the third parameter pretty prints. 
      const langJSON = JSON.stringify(langObj, null, 4);
      fs.writeFileSync("demo/" + langKey, langJSON);
    }
    catch (e) {
      console.log("Translate json errored", e)
    }
  }
  //Exit demo, comment this to demonstrate all translations if desired. 
  throw new Error("Exiting demo.");
}

/**
 * Used to interface with the GCloud translate function.
 * @param {String or Array of Strings} text The text to translate
 * @param {String} target ISO-639-1 compliant language code parameters. View the list here https://cloud.google.com/translate/docs/languages
 * @param {Translate} translate Translate object used to access the GCloud services.
 * @returns 
 */
async function translateText(text, target, translate) {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(text, target);
  //translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });
  return translations;
}
