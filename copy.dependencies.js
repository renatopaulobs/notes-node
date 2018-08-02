const fs = require('fs-extra');
const licensesList = require('./manage.dependencies.js');
const licenses = licensesList();
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const nodeModulesPath = './node_modules';
const dependenciesPath = './dependencies';
const aboutFileName = 'About_SC_SIDI.txt';
const pendingFileName = 'Pending_About_SC_SIDI.txt';
const solutionName = 'Solution - Microservice SC';
const versionName = 'Version 00.01.00';
const headerInfo = `The following software may be included in this product:\n\n`;

//fs.writeFileSync('licenses-data.json', JSON.stringify(licenses, undefined, 2))
//Copy dependencies from node_modules to dependencies
if (packages && packages.dependencies) {
    var dep = [];
    var licenseNumber = 0;
    let installedDependencies = [];
    if (fs.existsSync(nodeModulesPath)) {
        installedDependencies = fs.readdirSync(nodeModulesPath);
        fs.emptyDirSync(dependenciesPath);
        for (let i=0; i<licenses.length; i++) {
            dep[i] = licenses[i].name;
            if (installedDependencies.find(dir => dir === dep[i] || dep[i].startsWith('@'))) {
                if(licenses[licenseNumber].type === null){
                    fs.copySync(`${nodeModulesPath}/${dep[i]}`, `${dependenciesPath}/No License/${dep[i]}`);
                    console.log(`Copied dependency: ${dep[i]}`); 
                }else {
                    fs.copySync(`${nodeModulesPath}/${dep[i]}`, `${dependenciesPath}/${licenses[licenseNumber].type}/${dep[i]}`);
                    console.log(`Copied dependency: ${dep[i]}`);
                }
                licenseNumber++;
            }else {
                if(fs.existsSync(licenses[i].path)) {
                    fs.copySync(`${licenses[i].path}`, `${dependenciesPath}/External/${dep[i]}`)
                    console.log(`Copied dependency: ${dep[i]}`)
                }
            } 
        }
    }else {
        console.log('Install dependencies first');
    }
    //Creating about file and setting info 
    if (fs.existsSync(dependenciesPath)) {
        let groupDependencies = [];
        groupDependencies = fs.readdirSync(dependenciesPath);
        fs.writeFileSync(`${dependenciesPath}/${aboutFileName}`, `${solutionName}\n${versionName}\n\n`)
        fs.writeFileSync(`${dependenciesPath}/${pendingFileName}`, `Pending Information Packages:\n\n`)
        groupDependencies.forEach((name) => {
            let licenseBody;
            let insideDependencies = fs.readdirSync(`${dependenciesPath}/${name}`);
            fs.appendFileSync(`${dependenciesPath}/${aboutFileName}`, headerInfo)
            insideDependencies.forEach((dep) => {
                for(var i=0; i<licenses.length; i++){
                    var licName = licenses[i].name
                    if(licName.startsWith('@')){
                        licName = licName.split('/')[0]
                    }
                    if(dep === licName){
                        licenseBody = licenses[i].text;
                        fs.appendFileSync(`${dependenciesPath}/${aboutFileName}`, `${licenses[i].name} v${licenses[i].version}\n${licenses[i].copyright}\n\n`);
                        console.log(`Added dependency: ${dep}`);
                        if(licenses[i].copyright === null || licenses[i].type === null){
                            if(licenses[i].copyright === null){
                            fs.appendFileSync( `${dependenciesPath}/${pendingFileName}`, `Copyright - ${licenses[i].name} v${licenses[i].version}\n`); 
                            }else {
                                fs.appendFileSync(`${dependenciesPath}/${pendingFileName}`, `License - ${licenses[i].name} v${licenses[i].version}\n`);
                            }
                        }
                    }
                }
            });
            fs.appendFileSync(`${dependenciesPath}/${aboutFileName}`, `${licenseBody}\n-----\n`)
        });
    }else {
        console.log('Unable to find dependencies path')
    }
}
