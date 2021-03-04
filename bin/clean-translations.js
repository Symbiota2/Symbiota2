const fs = require('fs');
const path = require('path');
const { glob } = require('glob')

const assetFiles = glob.sync(
    path.resolve(__dirname, "..", "apps", "ui", "src", "assets", "i18n", "*.json")
);

assetFiles.forEach((file) => {
    console.log(`Deleting ${path.basename(file)}...`)
    fs.unlinkSync(file);
});
