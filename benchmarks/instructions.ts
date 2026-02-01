import { addBench, printout } from '../src/bench';
import { initBenches, getNow, formatMs, warmup } from '../src/utils';

const benches = initBenches();

addBench(
    'switch case vs if else with string',
    (details) => {
        const string: string = 'abcdef';

        const iterations = details.iterations;

        warmup();

        const switch1 = getNow();
        for (let i = 0; i < iterations; i++) {
            switch (string) {
                case 'a': {
                    continue;
                }
                case 'ab': {
                    continue;
                }
                case 'abc': {
                    continue;
                }
                case 'abcd': {
                    continue;
                }
                case 'abcde': {
                    continue;
                }
                case 'abcdef': {
                    continue;
                }
                default: {
                    continue;
                }
            }
        }

        const switch2 = getNow();

        const if1 = getNow();

        for (let i = 0; i < iterations; i++) {
            if (string === 'a') {
                continue;
            }

            if (string === 'ab') {
                continue;
            }

            if (string === 'abc') {
                continue;
            }

            if (string === 'abcd') {
                continue;
            }

            if (string === 'abcde') {
                continue;
            }

            if (string === 'abcdef') {
                continue;
            }

            continue;
        }
        const if2 = getNow();

        return {
            'switch case': formatMs(switch2 - switch1),

            'if else': formatMs(if2 - if1),
        };
    },

    benches,

    { iterations: 1_000_000 },
);

printout(benches);
