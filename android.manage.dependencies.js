const fs = require('fs-extra');
const projectPath = 'C:/Paulo.Renato/Projects/Technical Report/ls-sw2-technical-report/Implementation/Mobile/Android/app/build/generated/unzip';
const licenseNames = ['AndroidManifest.xml', 'AndroidManifest'];
const copyrightNames = ['Copyright (c)', 'Copyright (C)', 'Amazon.com, Inc. or its affiliates', 'Copyright Mathias Bynens', 'Copyright'];
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
  return (exists >= 1)
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
  if (fs.existsSync(projectPath)) {
    let dependencies = []
    dependencies = fs.readdirSync(projectPath);
    console.log(contains("Copyright (C)", copyrightNames).toString());
    Object.keys(dependencies).forEach((name) => {
        licenses.push({
          name: dependencies[name],
          path: `${projectPath}/${dependencies[name]}`,
          copyright: getCopyright(`${projectPath}/${dependencies[name]}`) || null
          //text: licenseBody.join('\n')        
        });
    });
  }
  fs.writeFileSync('android-dependencies.json', JSON.stringify(licenses, undefined, 2))
  return licenses;
}
module.exports = () => getLicenses();