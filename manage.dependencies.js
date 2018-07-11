const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const projectPath = './';
const licenses = [];

var licenseBody = [];
var copyright = [];

//Getting License Info from nodemodule file
const getLicenseInfo = (path) => {
  const licenseNames = ['LICENSE.md', 'LICENSE', 'LICENCE', 'LICENSE.markdown', 'LICENSE.txt'];
  const license = licenseNames.find(name => fs.existsSync(`${path}/${name}`));

  if (!license) {
    return null;
  }
  return fs.readFileSync(`${path}/${license}`).toString();
}

//Verify if string contains a word in the array
const contains = (text, wordArray) => {
  var exists = 0;
  wordArray.forEach((word) => { exists = exists + text.includes(word); });
  return (exists === 1)
}

//Getting Copyright from License Text
const getCopyright = (path) => {
  copyright = [];
  licenseBody = [];
  var copyrightNames = ['Copyright (c)', 'Copyright (C)', 'Amazon.com, Inc. or its affiliates'];
  if(getLicenseInfo(path)) {
      var numberCopy = 0;
      var numberText = 0;
      var allText = getLicenseInfo(path).split('\n');
    for(var subText=0; subText<allText.length; subText++){
      if(contains(allText[subText], copyrightNames)){
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

//Getting all name licenses from package.json and their properties from node_modules
const getLicenses = (path = projectPath) => {
  if (packages) {
    Object.keys(packages.dependencies).forEach((name) => {
        packageJson = JSON.parse(fs.readFileSync(`${path}/node_modules/${name}/package.json`).toString());
        licenses.push({
          name: name,
          path: `${path}/node_modules/${name}`,
          copyright: getCopyright(`${path}/node_modules/${name}`) || '****Without Copyright Information****',
          text: licenseBody.join('\n'),        
          type: packageJson.license || null,
          version: packageJson.version,
        });
    });
  }   
  return licenses;
}

module.exports = () => getLicenses(projectPath);

