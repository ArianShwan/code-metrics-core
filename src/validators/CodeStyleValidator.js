class CodeStyleValidator {
  checkConsoleStatements(code, issues) {
    const consoleCount = (code.match(/console\.(log|warn|error|info)/g) || []).length
    if (consoleCount > 5) {
      issues.push(`${consoleCount} console statements found - consider removing for production`)
    }
  }

  checkLongLines(content, issues) {
    const lines = content.split('\n')
    const longLines = lines.filter(line => line.length > 120).length
    if (longLines > 0) {
      issues.push(`${longLines} lines exceed 120 characters`)
    }
  }

  checkDeepNesting(code, issues) {
    let maxDepth = 0
    let currentDepth = 0

    for (let char of code) {
      if (char === '{') {
        currentDepth++
        maxDepth = Math.max(maxDepth, currentDepth)
      } else if (char === '}') {
        currentDepth--
      }
    }

    if (maxDepth > 5) {
      issues.push(`Deep nesting detected (${maxDepth} levels) - consider refactoring`)
    }
  }

  checkCommentRatio(content, issues) {
    const LineAnalyzer = require('../analyzers/LineAnalyzer')
    const CommentAnalyzer = require('../analyzers/CommentAnalyzer')

    const lineAnalyzer = new LineAnalyzer()
    const commentAnalyzer = new CommentAnalyzer()

    const lines = lineAnalyzer.countLines(content)
    const comments = commentAnalyzer.analyzeComments(content)
    const ratio = comments.total / lines.total

    if (ratio < 0.1) {
      issues.push(`Low comment ratio (${Math.round(ratio * 100)}%) - consider adding more documentation`)
    }
  }

  checkFunctionLength(content, functionPatterns, issues) {
    const FunctionAnalyzer = require('../analyzers/FunctionAnalyzer')
    const LineAnalyzer = require('../analyzers/LineAnalyzer')

    const functionAnalyzer = new FunctionAnalyzer()
    const lineAnalyzer = new LineAnalyzer()

    const functions = functionAnalyzer.analyzeFunctions(content, functionPatterns)
    const lines = lineAnalyzer.countLines(content)

    if (functions.count > 0 && (lines.code / functions.count) > 50) {
      issues.push('Functions may be too long - consider breaking them down')
    }
  }
}

module.exports = CodeStyleValidator
