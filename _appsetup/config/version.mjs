import fs from "fs/promises";

const apps = ["admin", "api", "landing", "redirector"];
let versionUpgrade = process.argv[2];
versionUpgrade = versionUpgrade.replaceAll("-", "") || "patch";

console.log(`Upgrading version ${versionUpgrade}`);

const packageJson = JSON.parse(await fs.readFile("package.json"));

const version = packageJson.version;
const [major, minor, patch] = version.split(".");

let newVersion = "";
if (versionUpgrade === "major") {
  newVersion = `${parseInt(major) + 1}.0.0`;
} else if (versionUpgrade === "minor") {
  newVersion = `${major}.${parseInt(minor) + 1}.0`;
} else {
  newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
}

packageJson.version = newVersion;
await fs.writeFile("package.json", JSON.stringify(packageJson, null, 2));

for (const app of apps) {
  const appPackageJson = await fs.readFile(`${app}/package.json`);
  const appPackage = JSON.parse(appPackageJson);
  appPackage.version = newVersion;
  await fs.writeFile(`${app}/package.json`, JSON.stringify(appPackage, null, 2));
}

console.log(`Bumped version from ${version} to ${newVersion}`);
console.log(`Don't forget to update the RELEASE_NOTES.md file!`)