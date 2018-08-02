const fs = require('fs-extra');
const decompress = require('decompress')
const licensesList = require('./android.manage.dependencies.js');
const mobilePath = 'C:/Paulo.Renato/Projects/Technical Report/ls-sw2-technical-report/Implementation/Mobile/Android/app';
const libsPath = 'C:/Paulo.Renato/Projects/Technical Report/ls-sw2-technical-report/Implementation/Mobile/Android/app/all-dependencies';

//decompress .jar and .aar libs
let dep = [];
let installedDependencies = [];
if (fs.existsSync(libsPath)) {
    installedDependencies = fs.readdirSync(libsPath);
    for (let i=0; i<installedDependencies.length; i++) {
        dep[i] = installedDependencies[i];         
        //decompress(`${libsPath}/${dep[i]}`, `${mobilePath}/build/generated/unzip/${dep[i]}`);
        //console.log(dep[i]);
    }
    const licenses = licensesList(dep);
    //console.log(licenses);
} else {
    console.log('Unable to locate path from android libs');
}

