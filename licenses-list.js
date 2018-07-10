const fs = require('fs');
//const licensesList = require('licenses-list-generator');
const licensesList = require('./dependecies-manager.js');
const licenses = licensesList();

//console.log(licenses);
fs.writeFileSync('licenses-data.json', JSON.stringify(licenses, undefined, 2));