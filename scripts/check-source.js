const fs=require('fs'),path=require('path'),parser=require('@babel/parser');
let count=0;
function walk(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())walk(file);else if(file.endsWith('.js')){parser.parse(fs.readFileSync(file,'utf8'),{sourceType:'module',plugins:['jsx']});count++;}}}
walk('src');parser.parse(fs.readFileSync('App.js','utf8'),{sourceType:'module',plugins:['jsx']});
console.info(`Validated ${count+1} JavaScript modules`);
