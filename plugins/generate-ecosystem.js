const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ecosystemDir = path.join(__dirname, '../ecosystem');
const outputFile = path.join(__dirname, '../src/config/EcosystemAppsList.ts');
const appOfTheWeekFile = path.join(__dirname, '../static/content/appoftheweek.json');
const publicAssetsDir = path.join(__dirname, '../static/assets/ecosystem');

// Ensure public assets directory exists
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}

// Ensure static/content directory exists
const contentDir = path.join(__dirname, '../static/content');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const apps = [];
let appOfTheWeek = null;
const folders = fs.readdirSync(ecosystemDir);

folders.forEach((folder) => {
  const folderPath = path.join(ecosystemDir, folder);
  const indexPath = path.join(folderPath, 'index.md');

  if (fs.existsSync(indexPath)) {
    const fileContent = fs.readFileSync(indexPath, 'utf-8');
    const { data } = matter(fileContent);

    // Skip if frontmatter is empty or has no name
    if (!data || Object.keys(data).length === 0 || !data.name) {
      console.log(`⏭️  Skipping ${folder} (empty or no name)`);
      return;
    }

    // Copy icon if it exists
    if (data.icon) {
      const iconSource = path.join(folderPath, data.icon);
      if (fs.existsSync(iconSource)) {
        const iconDest = path.join(
          publicAssetsDir,
          `${folder}-icon${path.extname(data.icon)}`
        );
        fs.copyFileSync(iconSource, iconDest);
        data.icon = `/assets/ecosystem/${folder}-icon${path.extname(data.icon)}`;
      }
    }

    // Copy bgImage if it exists
    if (data.bgImage) {
      const bgSource = path.join(folderPath, data.bgImage);
      if (fs.existsSync(bgSource)) {
        const bgDest = path.join(
          publicAssetsDir,
          `${folder}-bg${path.extname(data.bgImage)}`
        );
        fs.copyFileSync(bgSource, bgDest);
        data.bgImage = `/assets/ecosystem/${folder}-bg${path.extname(data.bgImage)}`;
      }
    }

    // Check if this is the app of the week
    if (data.appoftheweek) {
      appOfTheWeek = data;
    }

    apps.push(data);
  }
});

// Sort apps: appoftheweek first, then by id (ascending order)
apps.sort((a, b) => {
  if (a.appoftheweek && !b.appoftheweek) return -1;
  if (!a.appoftheweek && b.appoftheweek) return 1;
  return (a.id || 999) - (b.id || 999);
});

// Custom JSON stringify with single quotes
const formatAppsList = (apps) => {
  const formattedApps = apps.map((app) => {
    const entries = Object.entries(app).map(([key, value]) => {
      if (Array.isArray(value)) {
        const items = value.map((v) => `'${v}'`).join(', ');
        return `    ${key}: [${items}]`;
      }
      if (typeof value === 'string') {
        return `    ${key}: '${value}'`;
      }
      return `    ${key}: ${value}`;
    });
    return `  {\n${entries.join(',\n')},\n  }`;
  });
  return formattedApps.join(',\n');
};

const output = `import { EcosystemApp } from '@site/src/components/Ecosystem/EcosystemBlocks';

export const EcosystemAppsList: EcosystemApp[] = [
${formatAppsList(apps)},
];
`;

fs.writeFileSync(outputFile, output);
console.log('✅ Generated EcosystemAppsList.ts with', apps.length, 'apps');

// Generate App of the Week JSON file
if (appOfTheWeek) {
  fs.writeFileSync(appOfTheWeekFile, JSON.stringify(appOfTheWeek, null, 2));
  console.log('✅ Generated appoftheweek.json with app:', appOfTheWeek.name);
} else {
  console.log('⚠️  No app marked as appoftheweek');
}
