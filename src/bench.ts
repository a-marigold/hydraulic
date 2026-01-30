import { stdout } from 'bun';

import { PRINT_GAP, MARKDOWN_GAP } from './constants';

import type { Benchmark, Benchmarks, UnknownBenchmark } from './types';

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
 * @param callback - Benchmark callback that returns `BenchmarkResult`w
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
 *
 */
export const addBench = <DetailsK extends string, DetailsT = never>(
    name: string,
    callback: Benchmark<DetailsK, DetailsT>['callback'],

    benchmarks: Benchmarks,
    details?: Benchmark<DetailsK, DetailsT>['details'],
): void => {
    benchmarks.set(name, { callback, details } as Benchmark<string, unknown>);
};

/**
 *
 *
 *
 * #### outputs the results of benchmarks to stdout
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
    let output: string = '';

    for (const benchmarkItem of benchmarks) {
        output += '\x1b[32;1m' + benchmarkItem[0] + ':\x1b[0m\n';

        const benchmark = benchmarkItem[1];

        const result = benchmark.callback(
            benchmark.details as UnknownBenchmark,
        );
        const details = benchmark.details;

        if (details) {
            output += '\x1b[31details:\x1b[0m\n';
            for (const name in details) {
                output +=
                    PRINT_GAP + name + ': \x1b[36m' + details[name] + '\x1b[0m';
            }
        }

        for (const name in result) {
            output +=
                PRINT_GAP + name + ': \x1b[36m' + result[name] + '\x1b[0m\n';
        }
    }

    stdout.write(output);
};

/**
 * #### generates markdown from `benchmarks`
 *
 *
 * @param benchmarks `Map` with benchmarks
 *
 *
 *
 * @returns generated markdown from `benchmarks` as string
 */
export const getMarkdown = (benchmarks: Benchmarks): string => {
    let markdown = '';

    for (const benchmark of benchmarks) {
        markdown += '## ' + benchmark[0] + '\n';

        const result = benchmark[1]();

        for (const name in result) {
            markdown +=
                MARKDOWN_GAP + '- ### ' + name + ': ' + result[name] + '\n';
        }
    }

    return markdown;
};
