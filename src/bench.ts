import { stdout } from 'bun';

import { RESULT_GAP } from './constants';

import type { BenchmarkResult, Benchmark, Benchmarks } from './types';

const _benchmarks: Benchmarks = new Map();

/**
 * #### Appends benchmark to the list of benchmarks.
 *
 *
 *
 *
 *
 * @param name - Name of the benchmark
 * @param benchmark - Benchmark callback that returns `BenchmarkResult`
 *
 * @example
 *
 * ```typescript
 * const bench: Benchmark = () => {
 *   const result: BenchmarkResult = [];
 *
 *   let str = '';
 *
 *   const time1 = performance.now();
 *   for(let i = 0; i < 1_000_000_000; i++) {
 *     str += 'Bun';
 *   }
 *   const time2 = performance.now();
 *
 *   result.push({ name: 'concatenation', value: (time2 - time1) + 'ms' });
 *
 *   return result;
 * }
 * ```
 */
export const addBench = (name: string, benchmark: Benchmark): void => {
    _benchmarks.set(name, benchmark);
};

export const runBenches = (): void => {
    for (const benchmark of _benchmarks) {
        stdout.write(benchmark[0] + '\n');

        const resultList = benchmark[1]();

        const resultLength = resultList.length;

        let resultIndex = 0;
        while (resultIndex < resultLength) {
            const result = resultList[resultIndex] as BenchmarkResult;

            stdout.write(RESULT_GAP + result.name + ':' + ' ' + result.value);

            ++resultIndex;
        }
    }
};
