const CodeAnalyzer = require ('./analyzer')
const CodeParser = require ('./parser')

class CodeMetrics {
  constructor() {
    this.analyzer = new CodeAnalyzer()
  }

  analyzeFile(filePath, content) {
    const parsed = this.parser.parse(filePath, content)

    return {
      fileName: filePath,
      lines: this.analyzer.countLines(content),
      comments: this.analyzer.analyzeComments(content),
      complexity: this.analyzer.calculateComplexity(content),
      functions: this.analyzer.analyzeFunctions(content),
      codeQuality: this.analyzer.analyzeCodeQuality(content)
    }
  }
}

module.exports = CodeMetrics