const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/ShopFinity/g, 'SnapCart');
    content = content.replace(/Shopfinity/g, 'SnapCart');
    content = content.replace(/shopfinity\.pk/g, 'snapcart.pk');
    content = content.replace(/\+92 300 1234567/g, '0370 5715285');
    content = content.replace(/\+923001234567/g, '03705715285');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated:', filePath);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.html') || fullPath.endsWith('.json')) {
                replaceInFile(fullPath);
            }
        }
    }
}

processDir('.');
console.log('Done replacing strings.');
