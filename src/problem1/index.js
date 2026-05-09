/**
 * Problem 1: Quick Reference
 * Three production-ready implementations of sum_to_n
 * 
 * All implementations include:
 * - Input validation (integer check)
 * - Negative number handling (documented design decision)
 * - Overflow protection (Approach A)
 * - Tail-call optimization (Approach C)
 */

// ✅ APPROACH A: Overflow-Safe Mathematical Formula - O(1) - RECOMMENDED
var sum_to_n_a = function(n) {
    if (!Number.isInteger(n)) {
        throw new TypeError(`Expected integer, got ${typeof n}: ${n}`);
    }
    if (n < 0) return -sum_to_n_a(-n);
    
    // Divide before multiplying to avoid intermediate overflow
    return (n % 2 === 0) ? (n / 2) * (n + 1) : n * ((n + 1) / 2);
};

// ✅ APPROACH B: Iterative Loop - O(n) - MOST READABLE
var sum_to_n_b = function(n) {
    if (!Number.isInteger(n)) {
        throw new TypeError(`Expected integer, got ${typeof n}: ${n}`);
    }
    if (n === 0) return 0;
    if (n < 0) return -sum_to_n_b(-n);
    
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// ✅ APPROACH C: Tail-Call Optimized Recursive - O(n) time, O(1)* space
// *O(1) space with TCO-compliant engine, O(n) without
var sum_to_n_c = function(n, accumulator = 0) {
    if (accumulator === 0 && !Number.isInteger(n)) {
        throw new TypeError(`Expected integer, got ${typeof n}: ${n}`);
    }
    if (n === 0) return accumulator;
    if (n < 0) return -sum_to_n_c(-n, 0);
    
    // Tail position - no pending operations after recursive call
    return sum_to_n_c(n - 1, accumulator + n);
};

// Quick verification
console.log('Valid inputs:');
console.log(sum_to_n_a(5));  // 15
console.log(sum_to_n_b(5));  // 15
console.log(sum_to_n_c(5));  // 15

console.log('\nInvalid input handling:');
try {
    sum_to_n_a(3.14);
} catch (e) {
    console.log('✓ Rejected float:', e.message);
}
