class LineAnalyzer {
  countLines(content) {
    const lines = content.split('\n')
    const totalLines = lines.length
    const emptyLines = lines.filter(line => line.trim() === '').length
    const codeLines = totalLines - emptyLines

    return {
      total: totalLines,
      empty: emptyLines,
      code: codeLines,
    }
  }
}

module.exports = LineAnalyzer
