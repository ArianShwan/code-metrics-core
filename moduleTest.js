const CodeMetrics = require('./src/index');
const fs = require('fs');

// Test the entire module
const analyzer = new CodeMetrics();

// Read a sample file (you can replace this with any JS file content)
const content = fs.readFileSync('./src/analyzer.js', 'utf8');
const result = analyzer.analyzeFile('./src/analyzer.js', content);

console.log('Full module test:');
console.log(JSON.stringify(result, null, 2));