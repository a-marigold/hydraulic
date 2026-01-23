import { addBench, printout } from '../bench';
import { now, initBenches } from '..';
import type { Benchmarks, BenchmarkResult } from '..';

const ITERATIONS = 1_000_000;

const spreadVsConcat = () => {
    const array = [
        1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
        1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
        1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
    ];
    const element = 1;
    const array2 = [
        10, 11, 12, 13, 15, 16, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4,
        5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4,
        5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4,
        5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4,
        5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
    ];
    const s1 = now();
    for (let i = 0; i < ITERATIONS; ++i) {
        [...array, element, ...array2];
    }
    const s2 = now();

    const c1 = now();

    for (let i = 0; i < ITERATIONS; ++i) {
        array.concat(element, array2);
    }

    const c2 = now();

    const result: BenchmarkResult[] = [
        { name: 'spread', value: s2 - s1 + 'ms' },
        { name: 'concat', value: c2 - c1 + 'ms' },
    ];

    return result;
};

const benchmarks = initBenches();

addBench('spread vs concat', spreadVsConcat, benchmarks);
printout(benchmarks);
