// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

const path = require("path");
const fs = require("fs");
const glob = require("glob");

// Creates a client
const symbiotaKey = fs.readFileSync("cloudKey.txt").toString('utf-8');
console.log(symbiotaKey);



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

const languagePrefixes = { 'en': 'English', 'ru': 'Russian' }


const outDir = path.resolve(path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n"));
const outDirApps = path.resolve(path.resolve(__dirname, "..", "apps"));
console.log("OutDir: ", outDir)

console.log("Pluginpattern:", pluginPattern)

const text = ['What\'s up guys welcome to Symbiota2', 'SOmething'];
const target = 'es';

[srcPattern, pluginPattern].forEach((pattern) => {
  glob.sync(pattern)
    .filter((file) => !file.startsWith(outDirApps))
    .forEach((file) => {
      const baseName = path.basename(file);
      const langKeys = Object.keys(languages);
      console.log("Path: ", path.dirname(file))
      console.log("BaseName: ", baseName.toString())
      if (!langKeys.includes(baseName)) {
        languages[baseName] = [];
      }
      languages[baseName].push(file);
    });
});

console.log("Languages dict", languages)

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

//translateText();