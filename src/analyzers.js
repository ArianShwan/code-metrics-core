/**
 * Line, Comment, Complexity, and Function analyzers
 * All analysis classes grouped in one file
 */

class LineAnalyzer {
  countLines(content) {
    const lines = content.split('\n')
    const totalLines = lines.length
    const emptyLines = lines.filter(line => line.trim() === '').length
    const codeLines = totalLines - emptyLines

    return {
      total: totalLines,
      empty: emptyLines,
      code: codeLines
    }
  }
}

class CommentAnalyzer {
  analyzeComments(content, commentPatterns) {
    const patterns = commentPatterns || {
      singleLine: /\/\/.*/g,
      multiLine: /\/\*[\s\S]*?\*\//g
    }

    const singleLineComments = content.match(patterns.singleLine) || []
    const multiLineComments = content.match(patterns.multiLine) || []

    return {
      total: singleLineComments.length + multiLineComments.length,
      singleLine: singleLineComments.length,
      multiLine: multiLineComments.length
    }
  }

  checkCommentRatio(content, lineCount, issues) {
    const comments = this.analyzeComments(content)
    const ratio = comments.total / lineCount

    if (ratio < 0.1) {
      issues.push(`Low comment ratio (${Math.round(ratio * 100)}%) - consider adding more documentation`)
    }
  }
}

class ComplexityAnalyzer {
  calculateComplexity(content, languagePatterns) {
    const codeOnly = this.removeCommentsAndEmptyLines(content)
    const complexityPatterns = languagePatterns || {
      'if': /\bif\b/g,
      'for': /\bfor\b/g,
      'while': /\bwhile\b/g,
      'switch': /\bswitch\b/g,
      'case': /\bcase\b/g,
      'catch': /\bcatch\b/g,
      'else if': /\belse if\b/g,
      'else': /\belse\b/g,
      '&&': /&&/g,
      '||': /\|\|/g,
      '?': /\?/g
    }

    const breakdown = {}
    let totalComplexity = 0

    Object.entries(complexityPatterns).forEach(([name, pattern]) => {
      const matches = codeOnly.match(pattern) || []
      const count = matches.length

      if (count > 0) {
        breakdown[name] = count
        totalComplexity += count
      }
    })

    return {
      total: totalComplexity,
      breakdown: breakdown
    }
  }

  removeCommentsAndEmptyLines(content) {
    return content
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*[\r\n]/gm, '')
  }
}

class FunctionAnalyzer {
  analyzeFunctions(content, functionPatterns) {
    const patterns = functionPatterns || [
      /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm,
      /(?:function|async\s+function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g
    ]

    const codeOnly = content
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')

    const functionNames = []
    const keywords = ['if', 'while', 'for', 'switch', 'catch', 'return', 'filter', 'match']

    patterns.forEach((pattern) => {
      let match
      while ((match = pattern.exec(codeOnly)) !== null) {
        if (match[1] && !keywords.includes(match[1])) {
          functionNames.push(match[1])
        }
      }
    })

    return {
      count: functionNames.length,
      names: [...new Set(functionNames)]
    }
  }

  checkFunctionLength(content, functionPatterns, lineCount, issues) {
    const functions = this.analyzeFunctions(content, functionPatterns)

    if (functions.count > 0 && (lineCount / functions.count) > 50) {
      issues.push('Functions may be too long - consider breaking them down')
    }
  }
}

class QualityScoreCalculator {
  calculateQualityScore(critical, errors, warnings) {
    let score = 100
    score -= critical.length * 25
    score -= errors.length * 10
    score -= warnings.length * 2

    return Math.max(0, score)
  }
}

module.exports = {
  LineAnalyzer,
  CommentAnalyzer,
  ComplexityAnalyzer,
  FunctionAnalyzer,
  QualityScoreCalculator
}
