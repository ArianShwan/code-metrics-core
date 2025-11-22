const BracketValidator = require('../validators/BracketValidator')
const SyntaxValidator = require('../validators/SyntaxValidator')
const CodeStyleValidator = require('../validators/CodeStyleValidator')

class QualityAnalyzer {
  constructor() {
    this.bracketValidator = new BracketValidator()
    this.syntaxValidator = new SyntaxValidator()
    this.codeStyleValidator = new CodeStyleValidator()
  }

  analyzeCodeQuality(content, functionPatterns) {
    const errors = []
    const warnings = []
    const critical = []

    const codeOnly = content
      .replace(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`/g, '""')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')

    this.bracketValidator.checkBalancedBrackets(codeOnly, critical)
    this.syntaxValidator.checkMissingSemicolons(codeOnly, critical)
    this.syntaxValidator.checkUnclosedStrings(content, critical)

    this.syntaxValidator.checkLooseEquality(codeOnly, errors)
    this.syntaxValidator.checkUnusedVariables(codeOnly, errors)
    this.syntaxValidator.checkMissingControlStructures(codeOnly, errors)
    this.syntaxValidator.checkPotentialTypeErrors(codeOnly, errors)

    this.codeStyleValidator.checkConsoleStatements(codeOnly, warnings)
    this.codeStyleValidator.checkLongLines(content, warnings)
    this.codeStyleValidator.checkDeepNesting(codeOnly, warnings)
    this.codeStyleValidator.checkCommentRatio(content, warnings)
    this.codeStyleValidator.checkFunctionLength(content, functionPatterns, warnings)

    return {
      summary: {
        critical: critical.length,
        errors: errors.length,
        warnings: warnings.length,
        total: critical.length + errors.length + warnings.length
      },
      details: {
        critical: critical,
        errors: errors,
        warnings: warnings
      },
      score: this.calculateQualityScore(critical, errors, warnings)
    }
  }

  calculateQualityScore(critical, errors, warnings) {
    let score = 100
    score -= critical.length * 25
    score -= errors.length * 10
    score -= warnings.length * 2

    return Math.max(0, score)
  }
}

module.exports = QualityAnalyzer
