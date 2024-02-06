import fs from "fs/promises";

const apps = ["admin", "api", "landing", "redirector"];

const packageJson = JSON.parse(await fs.readFile("package.json"));

const version = packageJson.version;
const [major, minor, patch] = version.split(".");
const newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;

for (const app of apps) {
  const appPackageJson = await fs.readFile(`${app}/package.json`);
  const appPackage = JSON.parse(appPackageJson);
  appPackage.version = newVersion;
  await fs.writeFile(`${app}/package.json`, JSON.stringify(appPackage, null, 2));
}