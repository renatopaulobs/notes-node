const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const projectPath = './';
const licenses = [];
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
  var copyright = [];
  licenseBody = [];
  if(getLicenseInfo(path)) {
      var numberCopy = 0;
      var numberText = 0;
      var allText = getLicenseInfo(path).split('\n');

    for(var subText=0; subText<allText.length; subText++){
      if(allText[subText].includes('Copyright')){
        copyright[numberCopy] = allText[subText];
        numberCopy++;    
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

module.exports = () => getLicenses(projectPath);
