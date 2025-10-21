const { RepositoryAnalyzer } = require('../src/index')

async function test() {
  const analyzer = new RepositoryAnalyzer()
  
  console.log('Starting repository analysis...\n')
  
  try {
    // Test med ditt eget repo
    const results = await analyzer.analyzeRepository(
      'https://github.com/ArianShwan/code-metrics-core.git',
      { verbose: true }
    )
    
    console.log('\n=== REPOSITORY SUMMARY ===')
    console.log(`Total files: ${results.summary.totalFiles}`)
    console.log(`Total lines: ${results.summary.totalLines}`)
    console.log(`Total code lines: ${results.summary.totalCodeLines}`)
    console.log(`Total functions: ${results.summary.totalFunctions}`)
    console.log(`Average complexity: ${results.summary.avgComplexity}`)
    console.log(`Average quality score: ${results.summary.avgQualityScore}/100`)
    
    console.log('\nLanguage distribution:')
    Object.entries(results.summary.languageDistribution).forEach(([lang, count]) => {
      console.log(`  ${lang}: ${count} files`)
    })
    
    console.log('\n✅ Test completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

test()