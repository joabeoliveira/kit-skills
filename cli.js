#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceDir = __dirname;
const targetDir = process.cwd();

const filesToCopy = [
  '.cursorrules',
  '.skills'
];

console.log('\n🚀 Iniciando a instalação do Kit Skills...');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    // Evita copiar arquivos do próprio git ou package.json do core se não desejar
    fs.copyFileSync(src, dest);
  }
}

try {
  filesToCopy.forEach(file => {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(targetDir, file);

    if (fs.existsSync(srcPath)) {
      console.log(`📦 Copiando ${file}...`);
      copyRecursiveSync(srcPath, destPath);
    }
  });

  console.log('\n✅ Kit Skills instalado com sucesso!');
  console.log('\n💡 Próximos passos:');
  console.log('1. Abra o arquivo .cursorrules para ver as instruções globais.');
  console.log('2. Explore a pasta .skills/ para entender as habilidades incluídas.');
  console.log('3. Se você usa Cursor ou Antigravity, eles lerão as regras automaticamente.\n');

} catch (err) {
  console.error('\n❌ Erro durante a instalação:', err.message);
  process.exit(1);
}
