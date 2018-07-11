const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const nodeModulesPath = './node_modules';
const dependenciesPath = './dependencies';
const licensesList = require('./dependecies-manager.js');
const licenses = licensesList();
const aboutFileName = 'About_SC.txt';
const solutionName = 'Solution - Microservice SC';
const versionName = 'Version 00.01.00';
var typeLicense = 0;

//fs.writeFileSync('licenses-data.json', JSON.stringify(licenses, undefined, 2))
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

//Setting About file  
if (fs.existsSync(dependenciesPath)) {
    let groupDependencies = [];
    groupDependencies = fs.readdirSync(dependenciesPath);
    fs.writeFileSync(aboutFileName, `${solutionName}\n${versionName}\n\n`)
    groupDependencies.forEach((name) => {
        let licenseBody;
        let insideDependencies = fs.readdirSync(`${dependenciesPath}/${name}`)
        fs.appendFileSync(aboutFileName, `The following software may be included in this product:\n\n`)
        insideDependencies.forEach((dep) => {
            for(var i=0; i<licenses.length; i++){
                if(dep === licenses[i].name){
                    licenseBody = licenses[i].text;
                    fs.appendFileSync(aboutFileName, `${licenses[i].name} v${licenses[i].version}\n${licenses[i].copyright}\n\n`);
                    console.log(`Added dependency: ${dep}`);
                }
            }
        });
        fs.appendFileSync(aboutFileName, `${licenseBody}\n-----\n\n`)
    });
}else {
    console.log('Unable to find dependencies path')
}