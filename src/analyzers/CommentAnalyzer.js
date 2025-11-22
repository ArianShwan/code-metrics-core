class CommentAnalyzer {
  analyzeComments(content, commentPatterns) {
    if(!commentPatterns){
      commentPatterns = {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      }
    }

    const singleLineComments = content.match(commentPatterns.singleLine) || []
    const multiLineComments = content.match(commentPatterns.multiLine) || []

    return {
      total: singleLineComments.length + multiLineComments.length,
      singleLine: singleLineComments.length,
      multiLine: multiLineComments.length
    }
  }
}

module.exports = CommentAnalyzer
