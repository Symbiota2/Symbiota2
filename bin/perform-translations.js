// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

const path = require("path");
const fs = require("fs");
const glob = require("glob");

// Creates a client
const symbiotaKey = fs.readFileSync("cloudKey.txt").toString('utf-8');


function translateJson(enContents, targetLangPath) {
  //Parse the english Json
  const contents = fs.readFileSync(targetLangPath).toString();
  try {
    const contentsJson = JSON.parse(contents);
    console.log("DOING TRANSLATE")
  }
  catch (e) {
    console.log("Translate json errored", e)
    throw `Invalid JSON at ${targetLangPath}: ${e}`;
  }
  console.log(Object.keys(enContents));
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

const languagePrefixes = ['en', 'ar', 'de', 'es', 'fa', 'fr', 'hi', 'it', 'ja', 'pt', 'ru', 'ur', 'zh'];
console.log("Finding es: ", languagePrefixes.find(lang => lang == 'es'));



const outDir = path.resolve(path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n"));
const outDirApps = path.resolve(path.resolve(__dirname, "..", "apps"));
console.log("OutDir: ", outDir);

console.log("Pluginpattern:", pluginPattern);

//const text = ['What\'s up guys welcome to Symbiota2', 'SOmething'];
//const target = 'es';

[srcPattern, pluginPattern].forEach((pattern) => {
  glob.sync(pattern)
    .filter((file) => !file.startsWith(outDirApps))
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

let enPaths = languages["en.json"]
var index = 0
enPaths.forEach(path => {
  console.log("Translating using en path ", index, path);
  var langIndex = 1;
  let currEnPath = enPaths[index];
  //console.log("Attempting to read English json at path: ", currEnPath)
  //Parse the english Json
  const contents = fs.readFileSync(currEnPath).toString();
  //console.log("Contents: ", contents)
  try {
    const enContentsJson = JSON.parse(contents);
    //If we can read the english json at the directory, commence translations.
    Object.keys(languages).forEach(langKey => {
      if (langKey != "en.json") {
        let targetLangPath = languages[langKey][index];
        //    console.log("LangKey: ", langKey);
        //    console.log("Lang Json Paths", langIndex, languages[langKey][0]);
        translateJson(enContentsJson, targetLangPath)
      }
    })
  }
  catch (e) {
    //console.log("Could not read json at path: ", currEnPath, " continuing to next directory.");
    //console.log(`Error: ${e}`);
    //throw `Invalid JSON at ${file}: ${e}`;
  }


  index++;
});
  //console.log(enPaths);


//translateText();