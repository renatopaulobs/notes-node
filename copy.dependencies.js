const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const nodeModulesPath = './node_modules';
const dependenciesPath = './dependencies';

if (packages && packages.dependencies) {
    let installedDependencies = [];
    if (fs.existsSync(nodeModulesPath)) {
        installedDependencies = fs.readdirSync(nodeModulesPath);
        fs.emptyDirSync(dependenciesPath);
        for (var dep in packages.dependencies) {
            if (installedDependencies.find(dir => dir === dep)) {
                fs.copySync(`${nodeModulesPath}/${dep}`, `${dependenciesPath}/${dep}`);
                console.log(`Copied dependency: ${dep}`);
            }
        }

    } else {
        console.log('Install dependencies first');
    }
}
