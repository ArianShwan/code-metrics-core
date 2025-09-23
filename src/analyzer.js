class CodeAnalyzer {

  countLines(content) {
    const lines = content.split('\n')
    const totalLines = lines.length
    const emptyLines = lines.filter(line => line.trim() === '').length
    const codeLines = totalLines - emptyLines

    return{
      total: totalLines,
      empty: emptyLines,
      code: codeLines,    }
  }

  analyzeComments(content) {
    const singleLineComments = content.match(/\/\/.*/g) || []
    const multiLineComments = content.match(/\/\*[\s\S]*?\*\//g) || []

    const totalComments = singleLineComments.length + multiLineComments.length

    return {
      total: totalComments,
      singleLine: singleLineComments.length,
      multiLine: multiLineComments.length
    }
  }

isCommentLine(line) {
    return line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')
  }

  calculateComplexity(content) {

    let codeOnly = content
    .replace(/\/\/.*$/gm, '') // Single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
    .replace(/^\s*[\r\n]/gm, '') // Empty lines

    const complexityPatterns = {
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
    let totalComplexity = 1

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

}

module.exports = CodeAnalyzer
