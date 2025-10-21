const { execSync } = require('child_process');
const CodeMetrics = require('../src/index');
const fs = require('fs');
const path = require('path');

/* ================= CHANGE REPO URL TO TEST ( USE HTTPS ) ================= */
const repoUrl = 'https://github.com/ArianShwan/code-metrics-core.git';
/* ================= CHANGE REPO URL TO TEST ( USE HTTPS ) ================= */

const results = analyzeGitRepository(repoUrl);

function analyzeGitRepository(repoUrl) {
  const analyzer = new CodeMetrics();
  const results = [];
  
  // Hard coded temp dir for simplicity
  const tempDir = './temp-repo-' + Date.now();
  
  try {
    console.log(`\nCloning: ${repoUrl}\n`);
    
    // Clone repository
    execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: 'inherit' });
    
    // Analyze all relevant files in the cloned repo
    function scanDirectory(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (file === '.git' || file === 'node_modules' || file.startsWith('.')) {
          return;
        }
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else {
          const ext = path.extname(file);
          const supportedExts = ['.js', '.jsx', '.ts', '.py', '.java', '.cpp'];
          
          if (supportedExts.includes(ext)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              const result = analyzer.analyzeFile(fullPath, content);
              results.push(result);
              console.log(`✓ ${fullPath}`);
            } catch (error) {
                console.error(`✗ ${file}:`, error.message);
              }
          }
        }
      });
    }
    
    // Start scanning from the cloned directory
    scanDirectory(tempDir);
    
    console.log(`\nCleaning up...`);
    fs.rmSync(tempDir, { recursive: true, force: true });
    
  } catch (error) {
    console.error('Error:', error.message);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
  
  return results;
}


if (results.length === 0) {
  console.log('\nNo files analyzed.');
  return;
}

console.log('\n=== DETAILED REPOSITORY ANALYSIS ===\n');

// Analyze per-file results
results.forEach((result, index) => {
  console.log(`\n[${index + 1}/${results.length}] ${result.fileName}`);
  console.log('─'.repeat(50));
  console.log(`Language: ${result.language}`);
  console.log(`Lines: total=${result.lines.total}, code=${result.lines.code}, empty=${result.lines.empty}`);
  console.log(`Comments: total=${result.comments.total}, single=${result.comments.singleLine}, multi=${result.comments.multiLine}`);
  console.log(`Functions: count=${result.functions.count}, names=[${result.functions.names.join(', ')}]`);
  console.log(`Complexity: ${result.complexity.total}`);
  
  const breakdown = Object.entries(result.complexity.breakdown)
    .map(([k, v]) => `${k}:${v}`).join(', ');
  console.log(`  Breakdown: (${breakdown})`);
  
  console.log(`  Issues: ${result.codeQuality.summary.critical} critical, ${result.codeQuality.summary.errors} errors, ${result.codeQuality.summary.warnings} warnings`);
  
  if (result.codeQuality.details.critical.length > 0) {
    console.log(`  Critical: ${result.codeQuality.details.critical.join('; ')}`);
  }
  if (result.codeQuality.details.errors.length > 0) {
    console.log(`  Errors: ${result.codeQuality.details.errors.join('; ')}`);
  }
  console.log(`Quality Score: ${result.codeQuality.score}/100`);
});

console.log('\n\n=== REPOSITORY SUMMARY ===');
console.log(`Total files: ${results.length}`);
console.log(`Total lines: ${results.reduce((s, r) => s + r.lines.total, 0)}`);
console.log(`Total code lines: ${results.reduce((s, r) => s + r.lines.code, 0)}`);
console.log(`Total functions: ${results.reduce((s, r) => s + r.functions.count, 0)}`);
console.log(`Average complexity: ${Math.round(results.reduce((s, r) => s + r.complexity.total, 0) / results.length)}`);
console.log(`Average quality score: ${Math.round(results.reduce((s, r) => s + r.codeQuality.score, 0) / results.length)}/100`);

// language distribution
const langs = {};
results.forEach(r => langs[r.language] = (langs[r.language] || 0) + 1);
console.log('\nLanguage distribution:');
Object.entries(langs).forEach(([l, c]) => console.log(`  ${l}: ${c} files`));