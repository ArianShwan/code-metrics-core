const CodeAnalyzer = require('./src/analyzer')

// Test-kod med massa olika konstruktioner
const testCode = `
// Detta är början på filen
/**
 * En stor multi-line kommentar som förklarar
 * vad denna funktion gör. Den har flera rader
 * och innehåller viktigt information.
 */
function calculateScore(player, level) {
    // Initiera variabler
    let score = 0;
    const multiplier = 10; // Poäng multiplikator
    
    /* 
     * Switch-sats för att hantera olika levels
     */
    switch (level) {
        case 'easy':
            score = player.points * 1; // Enkelt läge
            break;
        case 'medium':
            score = player.points * 2; // Medium läge  
            break;
        case 'hard':
            score = player.points * 3; // Svårt läge
            break;
        default:
            score = player.points; // Default poäng
    }
    
    // Loop för bonus-poäng
    for (let i = 0; i < player.achievements.length; i++) {
        if (player.achievements[i].type === 'bonus') {
            score += 100; // Bonus poäng
        }
    }
    
    // While-loop för streak-bonus
    let streak = player.streak;
    while (streak > 0) {
        if (streak >= 5) {
            score *= 1.1; // 10% bonus för streak
        }
        streak--;
    }
    
    /**
     * Nested if-satser för att kolla special conditions
     */
    if (player.premium) {
        if (player.level > 10) {
            if (score > 1000) {
                score *= 2; // Dubbla poäng för premium users
            }
        }
    }
    
    // Array iteration med forEach
    const powerUps = ['speed', 'shield', 'double_score'];
    powerUps.forEach(powerUp => {
        // Inline kommentar i forEach
        if (player.powerUps.includes(powerUp)) {
            score += 50; // PowerUp bonus
        }
    });
    
    /* En till multi-line kommentar */
    return score;
}

// En annan funktion med massa if-satser
function validateUser(user) {
    // Kolla användardata
    if (!user) {
        return false; // Ingen användare
    }
    
    if (!user.name) {
        return false; // Inget namn
    }
    
    if (user.age < 13) {
        return false; // För ung
    }
    
    // For-loop för att kolla email format
    for (let char of user.email) {
        if (char === '@') {
            // Hittade @ symbol
            return true;
        }
    }
    
    return false; // Ogiltig email
}

/*
 * Sista funktionen med try-catch och mer komplexitet
 */
async function processData(data) {
    // Try-catch block
    try {
        // Nested loop
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].items.length; j++) {
                if (data[i].items[j].active) {
                    // Process active items
                    await processItem(data[i].items[j]);
                }
            }
        }
    } catch (error) {
        // Error handling
        console.error('Processing failed:', error);
        throw error;
    }
}

// En tom rad här

// Sista kommentaren i filen
`;

// I slutet av testFil.js, ersätt din nuvarande test-kod med:

const analyzer = new CodeAnalyzer();
const lines = analyzer.countLines(testCode);
const comments = analyzer.analyzeComments(testCode);
const complexity = analyzer.calculateComplexity(testCode);
const functions = analyzer.analyzeFunctions(testCode);
const codeQuality = analyzer.analyzeCodeQuality(testCode);

console.log('\n=== COMPLETE ANALYSIS ===');
console.log('Lines:', lines);
console.log('Comments:', comments);
console.log('Complexity:', complexity);
console.log('Functions:', functions);
console.log('Code Quality:', codeQuality);

// Visa complexity breakdown snyggare
console.log(`\nComplexity: ${complexity.total}`);
if (Object.keys(complexity.breakdown).length > 0) {
  const breakdownParts = Object.entries(complexity.breakdown)
    .map(([name, count]) => `${name}: ${count}`);
  console.log(`(${breakdownParts.join(', ')})`);
}

// Visa kvalitetssammanfattning
console.log(`\nQuality Score: ${codeQuality.score}/100`);
console.log(`Issues: ${codeQuality.summary.critical} critical, ${codeQuality.summary.errors} errors, ${codeQuality.summary.warnings} warnings`);