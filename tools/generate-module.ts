import * as fs from 'fs';
import * as path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Please provide a module name:');
  console.error('Usage: npx ts-node tools/generate-module.ts <module-name>');
  process.exit(1);
}

const basePath = path.join(__dirname, '..', 'src', 'modules', moduleName);

const folders = [
  'application/dto',
  'application/use-cases',
  'application/validators',
  'domain/entities',
  'domain/interfaces',
  'domain/mappers',
  'infrastructure/prisma/persistence',
];

const files: Record<string, string> = {
  [`${moduleName}.controller.ts`]: ``,
  [`${moduleName}.module.ts`]: ``,
  [`infrastructure/prisma/persistence`]: ``,
};

folders.forEach((folder) => {
  const dirPath = path.join(basePath, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(basePath, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
  }
});

console.log(
  `✅ Module '${moduleName}' created successfully at src/modules/${moduleName}`,
);
