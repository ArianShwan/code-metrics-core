class SyntaxValidator {
  checkMissingSemicolons(code, issues) {
    const lines = code.split('\n')
    let missingSemicolons = 0

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed &&
          !trimmed.endsWith(';') &&
          !trimmed.endsWith('{') &&
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('//') &&
          !trimmed.match(/^(if|else|for|while|switch|function|class)/)) {
        missingSemicolons++
      }
    })

    if (missingSemicolons > 5) {
      issues.push(`${missingSemicolons} statements missing semicolons`)
    }
  }

  checkUnclosedStrings(content, issues) {
    const stringMatches = content.match(/["'`]/g) || []
    if (stringMatches.length % 2 !== 0) {
      issues.push('Possible unclosed string literal')
    }
  }

  checkLooseEquality(code, issues) {
    const looseEquality = (code.match(/[^!=]==|!=/g) || []).length
    if (looseEquality > 0) {
      issues.push(`${looseEquality} instances of loose equality (== or !=) - use === or !==`)
    }
  }

  checkUnusedVariables(code, issues) {
    const declarations = code.match(/(?:var|let|const)\s+(\w+)/g) || []
    const variableNames = declarations.map(decl => decl.split(/\s+/)[1])

    variableNames.forEach(varName => {
      const usage = new RegExp(`\\b${varName}\\b`, 'g')
      const usageCount = (code.match(usage) || []).length
      if (usageCount <= 1) {
        issues.push(`Variable '${varName}' appears to be unused`)
      }
    })
  }

  checkMissingControlStructures(code, issues) {
    const ifWithoutBraces = (code.match(/if\s*\([^)]+\)\s*[^{]/g) || []).length
    if (ifWithoutBraces > 0) {
      issues.push(`${ifWithoutBraces} if statements without braces`)
    }
  }

  checkPotentialTypeErrors(code, issues) {
    const nullComparisons = (code.match(/==\s*null|null\s*==/g) || []).length
    if (nullComparisons > 0) {
      issues.push(`${nullComparisons} potential null comparison issues`)
    }
  }
}

module.exports = SyntaxValidator
