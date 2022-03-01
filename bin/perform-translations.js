// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

const path = require("path");
const fs = require("fs");
const glob = require("glob");

// Creates a client
const symbiotaKey = fs.readFileSync("cloudKey.txt").toString('utf-8');


function translateJson(enContents, languages, jsonFileIndex) {
  //Parse the english Json
  const targetLangPrefixes = ['ar', 'de', 'es', 'fa', 'fr', 'hi', 'it', 'ja', 'pt', 'ru', 'ur', 'zh'];
  //console.log("About to read languages: ", languages);
  const contents = fs.readFileSync(languages['es.json'][jsonFileIndex]).toString();
  const englishKeys = Object.keys(enContents);
  targetLangPrefixes.forEach(langPrefix => {
    let langKey = langPrefix + ".json";
    console.log("Lang Prefix curr: ", langPrefix);
    console.log("LangKey curr: ", langKey);
    console.log("Lang Prefix currPath: ", languages[langKey][jsonFileIndex]);
  })
  try {
    const contentsJson = JSON.parse(contents);
    console.log("DOING TRANSLATE")
  }
  catch (e) {
    console.log("Translate json errored", e)
    throw `Error in translateJson(): ${e}`;
  }
}

async function translateText() {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(text, target);
  //translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });
}


//Make sure you have the key file needed to use the API stored locally! Find it on GCloud.
//This allows us to use a generic API key instead of an application service account for authentication.
const translate = new Translate({ key: symbiotaKey });

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
console.log("Languages dict", languages)

let enPaths = languages["en.json"]
var index = 0
//Compare each english path (file) to each other language file and translate
enPaths.forEach(path => {
  console.log("Translating using en path ", index, path);
  let currEnPath = enPaths[index];
  console.log("Attempting to read English json at path: ", currEnPath)
  //Parse the english Json
  const contents = fs.readFileSync(currEnPath).toString();
  //console.log("Contents: ", contents)
  try {
    const enContentsObj = JSON.parse(contents);
    //console.log("Calling translateJson with languages: ", languages);
    translateJson(enContentsObj, languages, index)
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
});
  //console.log(enPaths);


//translateText();