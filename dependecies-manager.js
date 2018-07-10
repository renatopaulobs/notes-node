const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const projectPath = './';
const licenses = [];
var copyright = [];
var licenseBody = [];

//Getting License Info from nodemodule file
const getLicenseInfo = (path) => {
  const licenseNames = ['LICENSE.md', 'LICENSE', 'LICENCE', 'LICENSE.markdown', 'LICENSE.txt'];
  const license = licenseNames.find(name => fs.existsSync(`${path}/${name}`));

  if (!license) {
    return null;
  }
  return fs.readFileSync(`${path}/${license}`).toString();
}

//Getting Copyright from License Text
const getCopyright = (path) => {
  if(getLicenseInfo(path)) {
      var numberOfCopy = 0;
      var numberText = 0;
      var allText = getLicenseInfo(path).split('\n');

    for(var subText=0; subText<allText.length; subText++){
      if(allText[subText].includes('Copyright')){
        copyright[numberOfCopy] = allText[subText];
        numberOfCopy++;    
      } else {
        licenseBody[numberText] = allText[subText];
        numberText++;
      }
    }
    return copyright.join('\n');
  }
}

//Getting all licenses from package.json and listing
const getLicenses = (path = projectPath) => {
  if (packages) {
    Object.keys(packages.dependencies).forEach((name) => {
        packageJson = JSON.parse(fs.readFileSync(`${path}/node_modules/${name}/package.json`).toString());
        licenses.push({
          name: name,
          path: `${path}/node_modules/${name}`,
          copyright: getCopyright(`${path}/node_modules/${name}`),
          text: licenseBody.join('\n'),        
          type: packageJson.license || null,
          version: packageJson.version,
        });
    });
  }   
  return licenses;
}

//getCopyright(`${projectPath}/node_modules/body-parser`);
//console.log(licenseBody.join('\n'))

module.exports = () => getLicenses(projectPath);
