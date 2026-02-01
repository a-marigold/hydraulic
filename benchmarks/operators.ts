import { addBench, printout } from '../src/bench';
import { initBenches, getNow, warmup, formatMs } from '../src/utils';

const benches = initBenches();

addBench(
    '?? vs ||',
    () => {
        const iterations = 1_000_000_000;

        const nullish = undefined;

        const nullish1 = getNow();

        for (let i = 0; i < iterations; i++) {
            nullish ?? '';
        }

        const nullish2 = getNow();

        const or1 = getNow();

        for (let i = 0; i < iterations; i++) {
            nullish || '';
        }

        const or2 = getNow();

        return {
            '??': formatMs(nullish2 - nullish1),

            '||': formatMs(nullish2 - nullish1),
        };
    },
    benches,
);

addBench(
    'pre increment vs post increment',
    () => {
        warmup();

        let megaNumber1 = 0;

        const pre1 = getNow();
        for (let i = 0; i < 1_000_000; ++i) {
            ++megaNumber1;
        }

        const pre2 = getNow();

        warmup();

        let megaNumber2 = 0;

        const post1 = getNow();
        for (let i = 0; i < 1_000_000; i++) {
            megaNumber2++;
        }
        const post2 = getNow();

        return {
            'pre increment': pre2 - pre1 + 'ms',
            'post increment': post2 - post1 + 'ms',
        };
    },
    benches,
);

printout(benches);
