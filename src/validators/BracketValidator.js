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

module.exports = BracketValidator
