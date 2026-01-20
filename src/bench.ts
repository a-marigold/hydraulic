import { stdout } from 'bun';

import { PRINT_GAP, MARKDOWN_GAP } from './constants';

import type { BenchmarkResult, Benchmark, Benchmarks } from './types';

/**
 * #### Appends benchmark to the list of benchmarks.
 *
 *
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
export const addBench = (
    name: string,
    benchmark: Benchmark,
    benchmarks: Benchmarks,
): void => {
    benchmarks.set(name, benchmark);
};

/**
 *
 *
 *
 *
 * @param benchmarks `Map` with benchmarks
 *
 * @example
 *
 * ```typescript
 * const exampleBenchCallback: Benchmark = () => [];
 * const benchmarks: Benchmarks = new Map(['My Bench', exampleBenchCallback]);
 *
 *
 * printout(benchmarks); // this will print the result of benchmarks to stdout
 * ```
 */
export const printout = (benchmarks: Benchmarks): void => {
    for (const benchmark of benchmarks) {
        stdout.write(benchmark[0] + ':\n');

        const resultList = benchmark[1]();
        const resultLength = resultList.length;

        let resultIndex = 0;

        while (resultIndex < resultLength) {
            const result = resultList[resultIndex] as BenchmarkResult;

            stdout.write(PRINT_GAP + result.name + ': ' + result.value + '\n');
            ++resultIndex;
        }
    }
};

export const getMarkdown = (benchmarks: Benchmarks): string => {
    let markdown = '';

    for (const benchmark of benchmarks) {
        markdown += '- ' + benchmark[0] + ':\n';

        const resultList = benchmark[1]();
        const resultLength = resultList.length;

        let resultIndex = 0;
        while (resultIndex < resultLength) {
            const result = resultList[resultIndex] as BenchmarkResult;

            markdown +=
                MARKDOWN_GAP + '- ' + result.name + ': ' + result.value + '\n';

            ++resultIndex;
        }
    }

    return markdown;
};

const benches: Benchmarks = new Map();
addBench('bench', () => [{ name: 'a', value: 'b' }], benches);

stdout.write(getMarkdown(benches));
