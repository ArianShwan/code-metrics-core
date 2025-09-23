class CodeAnalyzer {

  countLines(content) {
    const lines = content.split('\n')
    const totalLines = lines.length
    const emptyLines = lines.filter(line => line.trim() === '').length
    
    const codeLines = lines.filter(line=> {
      const trimmed = line.trim()

      return trimmed !== '' && !this.isCommentLine(trimmed)
    }).length

    return{
      total: totalLines,
      empty: emptyLines,
      code: codeLines,
      comments: totalLines - emptyLines - codeLines
    }
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
    let complexity = 1

    const decisionKeywords = ['if', 'for', 'while', 'case', 'catch', '&&', '||', '?']

    complexityKeywords.forEach(keyword => {
      let regex

      if (keyword === '&&' || keyword === '||') {
        regex = new RegExp(`\\${keyword}`, 'g')
      } else if (keyword === '?') {
        regex = new RegExp(`\\${keyword}`, 'g')
      } else {
        regex = new RegExp(`\\b${keyword}\\b`, 'g')
      }

      const matches = content.match(regex) || []
      complexity += matches.length
    })
    return complexity
  }
}
module.exports = CodeAnalyzer