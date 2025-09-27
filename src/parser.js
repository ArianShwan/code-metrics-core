class CodeParser {
  
  // Detect programming language based on file extension
  detectLanguage(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript', 
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala'
    };
    
    return languageMap[extension] || 'generic';
  }

  // Specifics to detect functions in different languages
  getCommentPatterns(language) {
    const patterns = {
      javascript: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      typescript: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      python: {
        singleLine: /#.*/g,
        multiLine: /"""[\s\S]*?"""|'''[\s\S]*?'''/g
      },
      java: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      cpp: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      c: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      csharp: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      php: {
        singleLine: /\/\/.*|#.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      ruby: {
        singleLine: /#.*/g,
        multiLine: /=begin[\s\S]*?=end/g
      },
      go: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      generic: {
        singleLine: /\/\/.*|#.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      }
    };
    
    return patterns[language] || patterns.generic;
  }

    parse(filePath, content) {
    const language = this.detectLanguage(filePath);
    
    return {
      language: language,
      commentPatterns: this.getCommentPatterns(language),
      functionPatterns: this.getFunctionPatterns(language),
      complexityPatterns: this.getComplexityPatterns(language),
      content: content
    };
  }
}

module.exports = CodeParser