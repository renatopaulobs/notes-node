const fs = require('fs-extra');
const unzip = require('unzip');
const licensesList = require('./manage.dependencies.js');
const mobilePath = 'C:/Paulo.Renato/Projects/Technical Report/ls-sw2-technical-report/Implementation/Mobile/Android/app';
const libsPath = 'C:/Paulo.Renato/Projects/Technical Report/ls-sw2-technical-report/Implementation/Mobile/Android/app/all-dependencies';

//Copy dependencies from node_modules to dependencies
if (libsPath) {
    let dep = [];
    let installedDependencies = [];
    if (fs.existsSync(libsPath)) {
        installedDependencies = fs.readdirSync(libsPath);
        //console.log(installedDependencies)
        for (let i=0; i<installedDependencies.length; i++) {
            dep[i] = installedDependencies[i];
            //fs.copySync(`${libsPath}/${dep[i]}`, `${mobilePath}/build/generated/unzip/${dep[i]}`);
            //console.log(`Copied dependency: ${dep[i]}`); 
        }
        console.log(dep[0])
        fs.createReadStream(`${libsPath}/${dep[0]}`).pipe(unzip.Extract({path: `${mobilePath}/build/generated/unzip/${dep[0]}`}))            
    }
}else {
    console.log('Install dependencies first');
}
