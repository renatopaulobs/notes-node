const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const projectPath = './';
const licenseNames = ['LICENSE.md', 'LICENSE', 'LICENSE-MIT', 'LICENCE', 'LICENSE.markdown', 'LICENSE.txt', 'LICENSE-MIT.txt'];
const copyrightNames = ['Copyright (c)', 'Copyright (C)', 'Amazon.com, Inc. or its affiliates', 'Copyright Mathias Bynens'];
const licenses = [];

var licenseBody = [];
var copyright = [];

//Getting License Info from nodemodule file
const getLicenseInfo = (path) => {
  const license = licenseNames.find(name => fs.existsSync(`${path}/${name}`));
  if (!license) {
    return null;
  }
  return fs.readFileSync(`${path}/${license}`).toString();
}
//Verify if string contains a word
const contains = (text, wordArray) => {
  var exists = 0;
  wordArray.forEach((word) => {
    exists = exists + text.includes(word)
  });
  return (exists === 1)
}
//Getting Copyright from License Text
const getCopyright = (path) => {
  copyright = [];
  licenseBody = [];
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
const getLicenses = () => {
  if (packages) {
    Object.keys(packages.dependencies).forEach((name) => {
        packageJson = JSON.parse(fs.readFileSync(`${projectPath}/node_modules/${name}/package.json`).toString());
        licenses.push({
          name: name,
          path: `${projectPath}/node_modules/${name}`,
          copyright: getCopyright(`${projectPath}/node_modules/${name}`) || null,
          text: licenseBody.join('\n'),        
          type: packageJson.license || null,
          version: packageJson.version,
        });
    });
  }   
  return licenses;
}

module.exports = () => getLicenses();