import { stdout as bunStdout } from 'bun';
import { stdout as processStdout } from 'node:process';

import { PRINT_GAP } from './constants';

import type {
    Benchmark,
    Benchmarks,
    OnlyBenchmarks,
    OutputFunction,
    UnknownBenchmarkDetails,
} from './types';

const writeToStdout = (bunStdout?.write as unknown)
    ? (data: string) => bunStdout.write(data)
    : (processStdout?.write as unknown)
      ? (data: string) => processStdout.write(data)
      : console.log;

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
 * @param callback - Benchmark callback that returns `BenchmarkResult`
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
 *
 * @param benchmarks `Map` with benchmarks to run
 * @param only Names of benchmarks to be run
 *
 * @example
 *
 * ```typescript
 * const exampleBenchCallback: Benchmark = () => [];
 *
 * const benchmarks: Benchmarks = new Map(['My Bench', exampleBenchCallback]);
 *
 *
 * printout(benchmarks); // this will print the result of benchmarks to stdout
 * ```
 */
export const printout: OutputFunction<void> = (benchmarks, only): void => {
    let output: string = '';

    const nestedPrintGap: string = PRINT_GAP + PRINT_GAP;

    let isOnlyMode = false;
    for (const _onlyName in only) {
        isOnlyMode = true;
        break;
    }

    for (const benchmarkItem of benchmarks) {
        const benchmarkName = benchmarkItem[0];

        if (!isOnlyMode || (only as OnlyBenchmarks)[benchmarkName]) {
            output += '\x1b[32;1m' + benchmarkItem[0] + ':\x1b[0m\n';

            const benchmark = benchmarkItem[1];

            const result = benchmark.callback(
                benchmark.details as UnknownBenchmarkDetails,
            );
            const details = benchmark.details;

            if (details) {
                output += PRINT_GAP + '\x1b[35mdetails:\x1b[0m\n';

                for (const name in details) {
                    output +=
                        nestedPrintGap +
                        name +
                        ': \x1b[36m' +
                        JSON.stringify(details[name], null, PRINT_GAP) +
                        '\x1b[0m\n';
                }
            }

            output += PRINT_GAP + '\x1b[31mresult:\x1b[0m\n';

            for (const name in result) {
                output +=
                    nestedPrintGap +
                    name +
                    ': \x1b[36m' +
                    result[name] +
                    '\x1b[0m\n';
            }
        }
    }
    writeToStdout(output);
};

/**
 * #### generates markdown from `benchmarks`
 * @param benchmarks `Map` with benchmarks
 *
 *
 *
 *
 *
 *
 * @returns generated markdown from `benchmarks` as string
 */
export const getMarkdown: OutputFunction<string> = (
    benchmarks,

    only,
): string => {
    let markdown = '';

    let isOnlyMode = false;
    for (const _onlyName in only) {
        isOnlyMode = true;
        break;
    }

    for (const benchmarkItem of benchmarks) {
        const benchmarkName = benchmarkItem[0];

        if (!isOnlyMode || (only as OnlyBenchmarks)[benchmarkName]) {
            markdown += '## ' + benchmarkName + '\n';

            const benchmark = benchmarkItem[1];

            const result = benchmark.callback(
                benchmark.details as UnknownBenchmarkDetails,
            );

            const details = benchmark.details;

            if (details) {
                markdown += '### details:\n';

                for (const name in details) {
                    markdown += '- #### ' + name + ': ' + details[name] + '\n';
                }
            }

            for (const name in result) {
                markdown += '- #### ' + name + ': ' + result[name] + '\n';
            }
        }
    }

    return markdown;
};
