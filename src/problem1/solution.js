/**
 * Problem 1: Three ways to sum to n
 * 
 * This module provides three different implementations for calculating
 * the sum of all integers from 1 to n (inclusive).
 */

/**
 * Approach A: Mathematical Formula (Gauss's Formula)
 * 
 * Uses the closed-form arithmetic series formula: n * (n + 1) / 2
 * This is the most efficient approach with O(1) time complexity.
 * Implements overflow protection by dividing before multiplying.
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * 
 * @param {number} n - Any integer (positive, negative, or zero)
 * @returns {number} The sum of all integers from 1 to n
 * @throws {TypeError} If n is not an integer
 * 
 * Design Decision: Negative inputs are interpreted as sum from 1 to |n|, then negated.
 * Example: sum_to_n(-3) = -(1+2+3) = -6
 */
var sum_to_n_a = function(n) {
    // Input validation: ensure n is an integer
    if (!Number.isInteger(n)) {
        throw new TypeError(`Expected integer, got ${typeof n}: ${n}`);
    }
    
    // Handle negative numbers by computing the negative sum
    // Design decision: sum_to_n(-3) = -(1+2+3) = -6
    if (n < 0) {
        return -sum_to_n_a(-n);
    }
    
    // Overflow-safe Gauss's formula
    // Divide BEFORE multiplying to avoid intermediate overflow
    // One of n or (n+1) is always even, so integer division is exact
    return (n % 2 === 0)
        ? (n / 2) * (n + 1)
        : n * ((n + 1) / 2);
};

/**
 * Approach B: Iterative Loop
 * 
 * Uses a traditional for-loop to accumulate the sum.
 * This is a straightforward, easy-to-understand approach.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * @param {number} n - Any integer (positive, negative, or zero)
 * @returns {number} The sum of all integers from 1 to n
 * @throws {TypeError} If n is not an integer
 * 
 * Design Decision: Negative inputs are interpreted as sum from 1 to |n|, then negated.
 * Example: sum_to_n(-3) = -(1+2+3) = -6
 * 
 * Note: For extreme robustness, a BigInt variant could be used as a reference
 * implementation for validation, though the problem guarantees results 
 * will be within Number.MAX_SAFE_INTEGER.
 */
var sum_to_n_b = function(n) {
    // Input validation: ensure n is an integer
    if (!Number.isInteger(n)) {
        throw new TypeError(`Expected integer, got ${typeof n}: ${n}`);
    }
    
    // Handle edge case
    if (n === 0) {
        return 0;
    }
    
    // Handle negative numbers
    if (n < 0) {
        return -sum_to_n_b(-n);
    }
    
    // Iteratively accumulate the sum
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    
    return sum;
};

/**
 * Approach C: Tail-Call Optimized Recursive
 * 
 * Uses tail-call optimized recursion with an accumulator parameter.
 * The recursive call is in tail position, allowing TCO-compliant engines
 * to reuse the stack frame and achieve O(1) space complexity.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1) with TCO, O(n) without TCO
 * 
 * @param {number} n - Any integer (positive, negative, or zero)
 * @param {number} accumulator - Accumulates the sum (default: 0)
 * @returns {number} The sum of all integers from 1 to n
 * @throws {TypeError} If n is not an integer
 * 
 * Design Decision: Negative inputs are interpreted as sum from 1 to |n|, then negated.
 * Example: sum_to_n(-3) = -(1+2+3) = -6
 * 
 * Note: Tail-call optimization requires strict mode in JavaScript engines
 * that support it (ES6+). The recursive call is in tail position with
 * no pending operations after it returns.
 */
var sum_to_n_c = function(n, accumulator = 0) {
    // Input validation: ensure n is an integer (only on initial call)
    if (accumulator === 0 && !Number.isInteger(n)) {
        throw new TypeError(`Expected integer, got ${typeof n}: ${n}`);
    }
    
    // Base case
    if (n === 0) {
        return accumulator;
    }
    
    // Handle negative numbers by redirecting to positive path
    if (n < 0) {
        return -sum_to_n_c(-n, 0);
    }
    
    // Tail-recursive case: no pending work after the recursive call
    // The addition happens BEFORE the recursive call, not after
    return sum_to_n_c(n - 1, accumulator + n);
};

// Export for use in other modules (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sum_to_n_a,
        sum_to_n_b,
        sum_to_n_c
    };
}

// Example usage and verification
if (require.main === module) {
    console.log('=== Testing sum_to_n implementations ===\n');
    
    const testCases = [0, 1, 5, 10, 100, -5];
    
    testCases.forEach(n => {
        const resultA = sum_to_n_a(n);
        const resultB = sum_to_n_b(n);
        const resultC = sum_to_n_c(n);
        
        console.log(`n = ${n}:`);
        console.log(`  sum_to_n_a: ${resultA}`);
        console.log(`  sum_to_n_b: ${resultB}`);
        console.log(`  sum_to_n_c: ${resultC}`);
        console.log(`  All match: ${resultA === resultB && resultB === resultC ? '✓' : '✗'}`);
        console.log('');
    });
    
    // Test input validation
    console.log('=== Testing input validation ===\n');
    try {
        sum_to_n_a(3.14);
    } catch (e) {
        console.log(`✓ Correctly rejected non-integer (3.14): ${e.message}`);
    }
    
    try {
        sum_to_n_a("5");
    } catch (e) {
        console.log(`✓ Correctly rejected string ("5"): ${e.message}`);
    }
}
