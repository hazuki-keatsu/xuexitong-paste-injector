// 用于将 dist/main.js 包装为 TamperMonkey 用户脚本格式
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../dist/main.js');
// 读取 package.json 获取 name 字段
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
const scriptName = pkg.name ? pkg.name.replace(/[^a-zA-Z0-9-_]/g, '_') : 'script';
const packageVersion = pkg.version ?? "unknown";
const outputPath = path.join(__dirname, `../dist/${scriptName}.user.js`);

const banner = `// ==UserScript==
// @name         超星学习通粘贴注入器
// @namespace    https://keatsu.top/
// @version      ${packageVersion}
// @description  解除超星学习通网页的禁止粘贴限制
// @author       Hazuki Keatsu
// @match        https://*.chaoxing.com/mooc-ans/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
`;

if (!fs.existsSync(inputPath)) {
    console.error('请先运行 tsc 生成 dist/main.js');
    process.exit(1);
}

const js = fs.readFileSync(inputPath, 'utf-8');
fs.writeFileSync(outputPath, banner + js);
fs.unlinkSync(path.join(__dirname, `../dist/main.js`));
console.log('TamperMonkey 用户脚本已生成:', outputPath);
