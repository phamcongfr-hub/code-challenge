/**
 * Test Suite for Problem 1: Three ways to sum to n
 * 
 * This file contains comprehensive tests to verify all three implementations
 * produce correct results for various input cases.
 */

const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./solution.js');

/**
 * Simple test runner
 */
function runTests() {
    let passed = 0;
    let failed = 0;
    
    console.log('🧪 Running Test Suite for sum_to_n\n');
    console.log('=' .repeat(50));
    
    const tests = [
        { input: 0, expected: 0, description: 'Zero' },
        { input: 1, expected: 1, description: 'One' },
        { input: 5, expected: 15, description: 'Positive small number (5)' },
        { input: 10, expected: 55, description: 'Positive medium number (10)' },
        { input: 100, expected: 5050, description: 'Positive large number (100)' },
        { input: -5, expected: -15, description: 'Negative number (-5)' },
        { input: -10, expected: -55, description: 'Negative number (-10)' },
        { input: 1000, expected: 500500, description: 'Very large number (1000)' }
    ];
    
    tests.forEach((test, index) => {
        console.log(`\nTest ${index + 1}: ${test.description}`);
        console.log(`Input: n = ${test.input}`);
        console.log(`Expected: ${test.expected}`);
        
        const resultA = sum_to_n_a(test.input);
        const resultB = sum_to_n_b(test.input);
        const resultC = sum_to_n_c(test.input);
        
        console.log(`  sum_to_n_a: ${resultA} ${resultA === test.expected ? '✓' : '✗'}`);
        console.log(`  sum_to_n_b: ${resultB} ${resultB === test.expected ? '✓' : '✗'}`);
        console.log(`  sum_to_n_c: ${resultC} ${resultC === test.expected ? '✓' : '✗'}`);
        
        if (resultA === test.expected && resultB === test.expected && resultC === test.expected) {
            console.log('  ✅ PASSED');
            passed++;
        } else {
            console.log('  ❌ FAILED');
            failed++;
        }
    });
    
    // Test input validation
    console.log('\n--- Testing Input Validation ---\n');
    
    const invalidInputs = [
        { value: 3.14, description: 'Float (3.14)' },
        { value: "5", description: 'String ("5")' },
        { value: NaN, description: 'NaN' },
        { value: Infinity, description: 'Infinity' }
    ];
    
    invalidInputs.forEach(test => {
        let allRejected = true;
        console.log(`Testing ${test.description}:`);
        
        ['sum_to_n_a', 'sum_to_n_b', 'sum_to_n_c'].forEach(funcName => {
            try {
                const func = funcName === 'sum_to_n_a' ? sum_to_n_a : 
                             funcName === 'sum_to_n_b' ? sum_to_n_b : sum_to_n_c;
                func(test.value);
                console.log(`  ${funcName}: ✗ Should have thrown`);
                allRejected = false;
            } catch (e) {
                console.log(`  ${funcName}: ✓ Correctly rejected`);
            }
        });
        
        if (allRejected) {
            console.log('  ✅ PASSED');
            passed++;
        } else {
            console.log('  ❌ FAILED');
            failed++;
        }
        console.log('');
    });
    
    const totalTests = tests.length + invalidInputs.length;
    
    console.log('\n' + '='.repeat(50));
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log(`Success Rate: ${((passed / totalTests) * 100).toFixed(1)}%\n`);
    
    return failed === 0;
}

// Performance comparison
function performanceTest() {
    console.log('\n⚡ Performance Comparison\n');
    console.log('='.repeat(50));
    
    const n = 10000;
    const iterations = 10000;
    
    // Test sum_to_n_a (Mathematical)
    const startA = Date.now();
    for (let i = 0; i < iterations; i++) {
        sum_to_n_a(n);
    }
    const timeA = Date.now() - startA;
    
    // Test sum_to_n_b (Iterative)
    const startB = Date.now();
    for (let i = 0; i < iterations; i++) {
        sum_to_n_b(n);
    }
    const timeB = Date.now() - startB;
    
    // Test sum_to_n_c (Recursive) - fewer iterations to avoid stack overflow
    const recursiveIterations = 100;
    const recursiveN = 100;
    const startC = Date.now();
    for (let i = 0; i < recursiveIterations; i++) {
        sum_to_n_c(recursiveN);
    }
    const timeC = Date.now() - startC;
    
    console.log(`sum_to_n_a (Mathematical): ${timeA}ms for ${iterations} iterations with n=${n}`);
    console.log(`sum_to_n_b (Iterative):    ${timeB}ms for ${iterations} iterations with n=${n}`);
    console.log(`sum_to_n_c (Recursive):    ${timeC}ms for ${recursiveIterations} iterations with n=${recursiveN} (limited due to stack)`);
    console.log(`\n🏆 Winner: sum_to_n_a (Mathematical formula is O(1))`);
    console.log('='.repeat(50) + '\n');
}

// Run all tests
if (require.main === module) {
    const success = runTests();
    performanceTest();
    
    process.exit(success ? 0 : 1);
}

module.exports = { runTests, performanceTest };
