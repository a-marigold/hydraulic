import { addBench, printout } from '../src/bench';
import { getNow, initBenches, warmup } from '../src';
import type { BenchmarkResult } from '../src';

const ITERATIONS = 1_000_000;

const spreadVsConcat = (): BenchmarkResult => {
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
    const s1 = getNow();
    for (let i = 0; i < ITERATIONS; ++i) {
        [...array, element, ...array2];
    }
    const s2 = getNow();

    const c1 = getNow();

    for (let i = 0; i < ITERATIONS; ++i) {
        array.concat(element, array2);
    }

    const c2 = getNow();

    return { spread: s2 - s1 + 'ms', concat: c2 - c1 + 'ms' };
};

const rightShiftVsMathFloor = (): BenchmarkResult => {
    warmup();

    const mf1 = getNow();

    for (let i = 0; i < ITERATIONS; i++) {
        Math.floor((i + 100) / 2);
    }
    const mf2 = getNow();

    warmup();

    const rs1 = getNow();
    for (let i = 0; i < ITERATIONS; i++) {
        (i + 100) >> 1;
    }

    const rs2 = getNow();

    return {
        'right shift': rs2 - rs1 + 'ms',

        'math floor': mf2 - mf1 + 'ms',
    };
};

const benchmarks = initBenches();

addBench('spread vs concat', spreadVsConcat, benchmarks, { abc: '' });
addBench('`>>` vs Math.floor', rightShiftVsMathFloor, benchmarks);

printout(benchmarks);
