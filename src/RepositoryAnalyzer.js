const { execSync } = require('child_process')
const CodeAnalyzer = require('./analyzer')
const CodeParser = require('./parser')
const fs = require('fs')
const path = require('path')

/**
 * RepositoryAnalyzer - Analyzes entire Git repositories
 * 
 * This class provides functionality to clone and analyze Git repositories,
 * generating comprehensive code metrics for all supported files.
 * 
 * @class RepositoryAnalyzer
 */
class RepositoryAnalyzer {
  constructor() {
    this.codeAnalyzer = new CodeAnalyzer()  // ← Ändra
    this.parser = new CodeParser()          // ← Lägg till
    this.supportedExts = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs']
  }

  /**
   * Analyzes a Git repository from a given URL
   * 
   * @param {string} repoUrl - The HTTPS Git repository URL
   * @param {Object} options - Optional configuration
   * @param {boolean} options.verbose - Enable verbose logging (default: false)
   * @param {string} options.tempDir - Custom temporary directory path
   * @returns {Promise<Object>} Analysis results with file details and summary
   * 
   * @example
   * const analyzer = new RepositoryAnalyzer()
   * const results = await analyzer.analyzeRepository('https://github.com/user/repo.git')
   * console.log(results.summary)
   */
  async analyzeRepository(repoUrl, options = {}) {
    const verbose = options.verbose || false
    const tempDir = options.tempDir || './temp-repo-' + Date.now()
    
    try {
      if (verbose) console.log(`Cloning repository: ${repoUrl}`)
      
      // Clone the repository
      execSync(`git clone ${repoUrl} ${tempDir}`, {
        stdio: verbose ? 'inherit' : 'pipe',
        encoding: 'utf-8'
      })
      
      // Scan and analyze all files
      const results = this.scanDirectory(tempDir, verbose)
      
      // Generate summary
      const summary = this.generateSummary(results)
      
      // Cleanup
      if (verbose) console.log('Cleaning up temporary files...')
      fs.rmSync(tempDir, { recursive: true, force: true })
      
      return {
        success: true,
        results,
        summary
      }
      
    } catch (error) {
      // Cleanup on error
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
      
      throw new Error(`Failed to analyze repository: ${error.message}`)
    }
  }

  /**
   * Recursively scans a directory and analyzes all supported files
   * 
   * @param {string} dir - Directory path to scan
   * @param {boolean} verbose - Enable verbose logging
   * @returns {Array} Array of analysis results
   */
  scanDirectory(dir, verbose = false) {
  const results = []
  
  const scan = (currentDir) => {
    const files = fs.readdirSync(currentDir)
    
    files.forEach(file => {
      // Skip hidden files, .git, and node_modules
      if (file.startsWith('.') || file === 'node_modules') {
        return
      }
      
      const fullPath = path.join(currentDir, file)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scan(fullPath)
      } else {
        const ext = path.extname(file)
        
        if (this.supportedExts.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8')
            const relativePath = path.relative(dir, fullPath)
            
            // Analyze the file using parser and analyzer
            const parsed = this.parser.parse(relativePath, content)
            const result = {
              fileName: relativePath,
              language: parsed.language,
              lines: this.codeAnalyzer.countLines(content),
              comments: this.codeAnalyzer.analyzeComments(content, parsed.commentPatterns),
              complexity: this.codeAnalyzer.calculateComplexity(content, parsed.complexityPatterns),
              functions: this.codeAnalyzer.analyzeFunctions(content, parsed.functionPatterns),
              codeQuality: this.codeAnalyzer.analyzeCodeQuality(content, parsed.functionPatterns)
            }
            
            results.push(result)
            if (verbose) console.log(`✓ Analyzed: ${relativePath}`)
          } catch (error) {
            if (verbose) console.error(`✗ Failed to analyze ${file}:`, error.message)
          }
        }
      }
    })
  }
  
  scan(dir)
  return results
}

  /**
   * Generates a summary from analysis results
   * 
   * @param {Array} results - Array of file analysis results
   * @returns {Object} Summary statistics including totals and averages
   */
  generateSummary(results) {
    if (results.length === 0) {
      return {
        totalFiles: 0,
        totalLines: 0,
        totalCodeLines: 0,
        totalFunctions: 0,
        avgComplexity: 0,
        avgQualityScore: 0,
        languageDistribution: {}
      }
    }
    
    const totalLines = results.reduce((sum, r) => sum + r.lines.total, 0)
    const totalCodeLines = results.reduce((sum, r) => sum + r.lines.code, 0)
    const totalFunctions = results.reduce((sum, r) => sum + r.functions.count, 0)
    const avgComplexity = Math.round(
      results.reduce((sum, r) => sum + r.complexity.total, 0) / results.length
    )
    const avgQualityScore = Math.round(
      results.reduce((sum, r) => sum + r.codeQuality.score, 0) / results.length
    )
    
    // Language distribution
    const languageDistribution = {}
    results.forEach(r => {
      languageDistribution[r.language] = (languageDistribution[r.language] || 0) + 1
    })
    
    return {
      totalFiles: results.length,
      totalLines,
      totalCodeLines,
      totalFunctions,
      avgComplexity,
      avgQualityScore,
      languageDistribution
    }
  }
}

module.exports = RepositoryAnalyzer