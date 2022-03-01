// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

const path = require("path");
const fs = require("fs");
const glob = require("glob");

runTranslations();



async function translateJson(enContents, languages, jsonFileIndex) {
  // Creates a client
  const symbiotaKey = fs.readFileSync("cloudKey.txt").toString('utf-8');
  //Make sure you have the key file needed to use the API stored locally! Find it on GCloud.
  //This allows us to use a generic API key instead of an application service account for authentication.
  const translate = new Translate({ key: symbiotaKey });

  //Parse the english Json
  const targetLangPrefixes = ['ar', 'de', 'es', 'fa', 'fr', 'hi', 'it', 'ja', 'pt', 'ru', 'ur', 'zh'];
  //console.log("About to read languages: ", languages);
  //const contents = fs.readFileSync(languages['es.json'][jsonFileIndex]).toString();
  const enKeys = Object.keys(enContents);
  let enVals = Object.values(enContents);
  /*console.log("Encontents: ", enContents)
  console.log("Enkeys: ", enKeys)
  console.log("Envalues: ", enVals)
  */

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
  console.log("OutDir: ", outDir);

  console.log("Pluginpattern:", pluginPattern);

  //const text = ['What\'s up guys welcome to Symbiota2', 'SOmething'];
  //const target = 'es';

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

  //translateJsons(languages, languagePrefixes)
  //console.log("Languages dict", languages)

  let enPaths = languages["en.json"];
  console.log("EnPaths: ", enPaths);
  var index = 0;

  //Compare each english path (file) to each other language file and translate
  for (index = 0; index < enPaths.length; index++) {
    let currEnPath = enPaths[index];
    console.log("Translating using en path ", index, currEnPath);
    //Parse the english Json
    const contents = fs.readFileSync(currEnPath).toString();
    //console.log("Contents: ", contents)
    try {
      const enContentsObj = JSON.parse(contents);
      //console.log("Calling translateJson with languages: ", languages);
      await translateJson(enContentsObj, languages, index)
      //If we can read the english json at the directory, commence translations.
      /*Object.keys(languages).forEach(langKey => {
        if (langKey != "en.json") {
          //let languages = languages[langKey];
          //    console.log("LangKey: ", langKey);
          //    console.log("Lang Json Paths", langIndex, languages[langKey][0]);
          
        }
      })*/
    }
    catch (e) {
      //console.log("Could not read json at path: ", currEnPath, " continuing to next directory.");
      //console.log(`Error: ${e}`);
      throw `Invalid JSON in main foreach: ${e}`;
    }


    index++;
  }
}
