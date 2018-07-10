const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const nodeModulesPath = './node_modules';
const dependenciesPath = './dependencies';
const licensesList = require('./dependecies-manager.js');
const licenses = licensesList();
var typeLicense = 0;

fs.writeFileSync('licenses-data.json', JSON.stringify(licenses, undefined, 2))

//Copy dependencies from node_modules to dependencies
if (packages && packages.dependencies) {
    let installedDependencies = [];
    if (fs.existsSync(nodeModulesPath)) {
        installedDependencies = fs.readdirSync(nodeModulesPath);
        fs.emptyDirSync(dependenciesPath);
        for (var dep in packages.dependencies) {
            if (installedDependencies.find(dir => dir === dep)) {
                if(licenses[typeLicense].type === null){
                    fs.copySync(`${nodeModulesPath}/${dep}`, `${dependenciesPath}/No License/${dep}`);
                    console.log(`Copied dependency: ${dep}`); 
                }else {
                    fs.copySync(`${nodeModulesPath}/${dep}`, `${dependenciesPath}/${licenses[typeLicense].type}/${dep}`);
                    console.log(`Copied dependency: ${dep}`);
                }
                typeLicense++;
            }
        }
    }else {
        console.log('Install dependencies first');
    }
}

//Setting .about File
