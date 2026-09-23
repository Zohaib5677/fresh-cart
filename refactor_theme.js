const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // text-white -> text-foreground
    content = content.replace(/text-white/g, 'text-foreground');
    // border-white -> border-foreground
    content = content.replace(/border-white/g, 'border-foreground');
    // bg-white -> bg-foreground (only for opacities like bg-white/10 or bg-white/[0.02])
    content = content.replace(/bg-white(\/|\[)/g, 'bg-foreground$1');
    // from-white -> from-foreground
    content = content.replace(/from-white/g, 'from-foreground');
    // to-white -> to-foreground
    content = content.replace(/to-white/g, 'to-foreground');
    
    // bg-black -> bg-background
    content = content.replace(/bg-black/g, 'bg-background');
    // text-black -> text-background
    content = content.replace(/text-black/g, 'text-background');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
