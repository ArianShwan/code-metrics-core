class FunctionAnalyzer {
  analyzeFunctions(content, functionPatterns) {
    if (!functionPatterns) {
      functionPatterns = [
        /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm,
        /(?:function|async\s+function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g
      ]
    }

    const codeOnly = content
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')

    const functionNames = []

    functionPatterns.forEach((pattern) => {
      let match
      while ((match = pattern.exec(codeOnly)) !== null) {
        if (match[1]) {
          const functionName = match[1]
          const keywords = ['if', 'while', 'for', 'switch', 'catch', 'return', 'filter', 'match']
          if (!keywords.includes(functionName)) {
            functionNames.push(functionName)
          }
        }
      }
    })

    return {
      count: functionNames.length,
      names: [...new Set(functionNames)]
    }
  }
}

module.exports = FunctionAnalyzer
