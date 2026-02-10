#!/usr/bin/env node
// @ts-nocheck

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => rl.question(prompt, resolve));

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const appConfigPath = path.join(__dirname, '..', 'app.config.ts');

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return version;
  }
}

function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

function updateAppConfig(newVersion) {
  let content = fs.readFileSync(appConfigPath, 'utf8');
  content = content.replace(
    /version:\s*['"][\d.]+['"]/,
    `version: '${newVersion}'`
  );
  fs.writeFileSync(appConfigPath, content);
}

async function main() {
  const currentVersion = getCurrentVersion();
  console.log(`\nCurrent version: ${currentVersion}\n`);

  const shouldUpdate = await question('Do you want to update the app version? (Y/n): ');

  if (shouldUpdate.toLowerCase() === 'n') {
    console.log('Skipping version update.\n');
    rl.close();
    return;
  }

  console.log('\nSelect version bump type:');
  console.log('  1) patch  (bug fixes)');
  console.log('  2) minor  (new features, dependency upgrades)');
  console.log('  3) major  (breaking changes)\n');

  const choice = await question('Enter choice (1/2/3): ');

  const typeMap = { '1': 'patch', '2': 'minor', '3': 'major' };
  const bumpType = typeMap[choice];

  if (!bumpType) {
    console.log('Invalid choice. Skipping version update.\n');
    rl.close();
    return;
  }

  const newVersion = bumpVersion(currentVersion, bumpType);

  console.log(`\nBumping version: ${currentVersion} → ${newVersion}\n`);

  updatePackageJson(newVersion);
  console.log('✓ Updated package.json');

  updateAppConfig(newVersion);
  console.log('✓ Updated app.config.ts');

  console.log(`\nVersion updated to ${newVersion}\n`);

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
