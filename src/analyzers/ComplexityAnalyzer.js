class ComplexityAnalyzer {
  calculateComplexity(content, languagePatterns) {
    let codeOnly = content
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*[\r\n]/gm, '')

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
}

module.exports = ComplexityAnalyzer
