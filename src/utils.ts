import type { Benchmarks } from './types';

/**
 * #### just returns `performance.now()`
 *
 * @returns {number} milliseconds timestamp
 */
export const getNow = () => performance.now();

/**
 *
 *
 *
 * #### Runs a loop on the specified `iterations` argument to warm the cpu up
 *
 *
 *
 * @param {number} iterations quantity of loop iterations
 */
export const warmup = (iterations: number = 1_000_000) => {
    for (let i = 0; i < iterations; i++) {}
};

/**
 * #### intializes a `Map` with type `Benchmarks`
 *
 * @returs initialized benchmarks
 */
export const initBenches = (): Benchmarks => {
    return new Map();
};
