const fs = require('fs-extra');
const packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const projectPath = process.cwd();
const licenses = [];

//Getting License Info from nodemodule file
const getLicenseInfo = (path) => {
  const licenseNames = ['LICENSE.md', 'LICENSE', 'LICENCE', 'LICENSE.markdown', 'LICENSE.txt'];
  const license = licenseNames.find(name => fs.existsSync(`${path}/${name}`));

  if (!license) {
    console.log('File license does not exist', path);
    return null;
  }
  return fs.readFileSync(`${path}/${license}`).toString();
}

//Getting all licenses from package.json and listing
const getLicenses = (path = projectPath) => {
  if (packages) {
    Object.keys(packages.dependencies).forEach((name) => {
        packageJson = JSON.parse(fs.readFileSync(`${path}/node_modules/${name}/package.json`).toString());
        licenses.push({
          name: name,
          path: `${path}/node_modules/${name}`,
          text: getLicenseInfo(`${path}/node_modules/${name}`),
          type: packageJson.license || null,
          version: packageJson.version,
        });
    });
  } 

  return licenses;
}

module.exports = () => getLicenses(projectPath);
