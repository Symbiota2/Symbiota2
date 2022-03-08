
/**
 * Usage: Input one or more folder names (max of 4) out of the following supported translation folders
 * ui-plugin-collection
 * ui-plugin-image
 * ui-plugin-occurrence
 * ui-plugin-taxonomy
 */
//Import libraries
const { Translate } = require('@google-cloud/translate').v2;

const path = require("path");
const fs = require("fs");
const glob = require("glob");
const dirName = __dirname


//If running on Windows, change the path to windows style slashes
//Universal regex replace as replaceAll is not defined for this nodejs version.
if (process.platform == "win32") {
  console.log("Platform is windows");
  dirName.replace('///g', "\\");
}

console.log("Platform dirname: ", dirName);

if (process.argv.length < 3) {
  throw new Error("Please input a plugin directory name to translate. Valid names: ui-plugin-collection, ui-plugin-image, ui-plugin-occurrence, ui-plugin-taxonomy, all.")
}

//Run the main script.

runTranslations().catch(console.error)








/**
 * Main runner function to refresh translation json files in the following directories:
 * libs/ui-plugin-collection/src/i18n
 * libs/ui-plugin-image/src/i18n
 * libs/ui-plugin-occurrence/src/i18n
 * libs/ui-plugin-taxonomy/src/i18n
 */
async function runTranslations() {
  const srcPattern = path.resolve(
    dirName,
    "..",
    "apps",
    "ui",
    "src",
    "**",
    "i18n",
    "*.json"
  );

  const pluginPattern = path.resolve(
    dirName,
    "..",
    "libs",
    "**",
    "i18n",
    "*.json"
  );

  const langPathsObj = {
    'ui-plugin-collection': path.resolve(dirName, "..", 'libs', 'ui-plugin-collection', 'src', 'i18n', '*.json'),
    'ui-plugin-image': path.resolve(dirName, "..", 'libs', 'ui-plugin-image', 'src', 'i18n', '*.json'),
    'ui-plugin-occurrence': path.resolve(dirName, "..", 'libs', 'ui-plugin-occurrence', 'src', 'i18n', '*.json'),
    'ui-plugin-taxonomy': path.resolve(dirName, "..", 'libs', 'ui-plugin-taxonomy', 'src', 'i18n', '*.json'),
  }

  let selectedDirs = []
  if (process.argv.includes("all")) {
    Object.keys(langPathsObj).forEach((key) => {
      selectedDirs.push(langPathsObj[key])
    })
  }
  else {
    for (let i = 2; i < process.argv.length; i++) {
      let currDir = langPathsObj[process.argv[i]]
      if (currDir == undefined) {
        throw new Error("Please input a valid plugin directory name. Valid names: ui-plugin-collection, ui-plugin-image, ui-plugin-occurrence, ui-plugin-taxonomy, all.");
      }
      selectedDirs.push(currDir);
    }
  }
  console.log("Selected Dirs", selectedDirs);

  const languages = {};
  const outDir = path.resolve(dirName, "..", "apps", "ui", "src", "assets", "i18n");
  //There was a json in ui-common that only had an english translation, so it was breaking the script.
  const extraEnDir = path.resolve(dirName, "..", "libs", "ui-common")
  const outDirApps = path.resolve(dirName, "..", "apps");
  const targetLangPrefixes = [];
  //console.log("Dirname", dirName);
  // libs\ui-plugin-collection

  //Builds the object representing all the language json files.
  selectedDirs.forEach((pattern) => {
    glob.sync(pattern)
      .filter((file) => !file.startsWith(outDirApps))
      .filter((file) => !file.startsWith(extraEnDir))
      .forEach((file) => {
        const baseName = path.basename(file);
        const langKeys = Object.keys(languages);
        const langPrefix = baseName.replace(".json", '')
        //console.log("Path: ", path.dirname(file))
        //console.log("BaseName: ", baseName.toString())
        if (!langKeys.includes(baseName)) {
          languages[baseName] = [];
        }
        languages[baseName].push(file);
        if (langPrefix != 'en' && !targetLangPrefixes.includes(langPrefix))
          targetLangPrefixes.push(langPrefix);

      });
  });

  let enPaths = languages["en.json"];
  console.log("EnPaths: ", enPaths);
  console.log("TargetLangPrefixes: ", targetLangPrefixes);


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
      await translateJson(enContentsObj, languages, index, targetLangPrefixes);
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
async function translateJson(enContents, languages, jsonFileIndex, targetLangPrefixes) {
  // Creates a client
  const symbiotaKey = fs.readFileSync("cloudKey.txt").toString('utf-8');
  //Make sure you have the key file needed to use the API stored locally! Find it on GCloud.
  //This allows us to use a generic API key instead of an application service account for authentication.
  const translate = new Translate({ key: symbiotaKey });



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
