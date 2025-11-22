/**
 * Bracket, Syntax, and Code Style validators
 * All validation classes grouped in one file
 */

class BracketValidator {
  checkBalancedBrackets(code, issues) {
    const brackets = { '(': 0, '[': 0, '{': 0 }
    const closers = { ')': '(', ']': '[', '}': '{' }

    for (let char of code) {
      if (Object.prototype.hasOwnProperty.call(brackets, char)) {
        brackets[char]++
      } else if (Object.prototype.hasOwnProperty.call(closers, char)) {
        const opener = closers[char]
        brackets[opener]--
        if (brackets[opener] < 0) {
          issues.push(`Unmatched closing '${char}'`)
          brackets[opener] = 0
        }
      }
    }

    Object.entries(brackets).forEach(([bracket, count]) => {
      if (count > 0) {
        issues.push(`${count} unclosed '${bracket}' bracket(s)`)
      }
    })
  }
}

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

  checkMissingControlStructures(code, issues) {
    const ifWithoutBraces = (code.match(/if\s*\([^)]+\)\s*[^{]/g) || []).length
    if (ifWithoutBraces > 0) {
      issues.push(`${ifWithoutBraces} if statements without braces`)
    }
  }
}

class CodeStyleValidator {
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

  checkPotentialTypeErrors(code, issues) {
    const nullComparisons = (code.match(/==\s*null|null\s*==/g) || []).length
    if (nullComparisons > 0) {
      issues.push(`${nullComparisons} potential null comparison issues`)
    }
  }

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
}

module.exports = {
  BracketValidator,
  SyntaxValidator,
  CodeStyleValidator
}
