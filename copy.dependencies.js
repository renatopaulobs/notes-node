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
    var licenseNumber = 0;
    let installedDependencies = [];
    if (fs.existsSync(nodeModulesPath)) {
        installedDependencies = fs.readdirSync(nodeModulesPath);
        fs.emptyDirSync(dependenciesPath);
        for (var dep in packages.dependencies) {
            /*Tentar ler as dependencias nao mais do packages.dependencies
            mas do licenses, pois dessa forma dará para mapear os packages
            que foram lidos do arquivo lib.js*/
            if (installedDependencies.find(dir => dir === dep)) {
                if(licenses[licenseNumber].type === null){
                    fs.copySync(`${nodeModulesPath}/${dep}`, `${dependenciesPath}/No License/${dep}`);
                    console.log(`Copied dependency: ${dep}`); 
                }else {
                    fs.copySync(`${nodeModulesPath}/${dep}`, `${dependenciesPath}/${licenses[licenseNumber].type}/${dep}`);
                    console.log(`Copied dependency: ${dep}`);
                }
                licenseNumber++;
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
                    if(dep === licenses[i].name){
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
