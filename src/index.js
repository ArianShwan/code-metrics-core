const CodeAnalyzer = require ('./src/analyzer')

class CodeMetrics {
  constructor(content) {
    this.analyzer = new CodeAnalyzer()
  }

  analyzeFile(content) {
    return {
      fileName: filePath,
      lines: this.analyzer.countLines(content),
      comments: this.analyzer.analyzeComments(content),
      complexity: this.analyzer.calculateComplexity(content)
    }
  }
}

module.exports = CodeMetrics