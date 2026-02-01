import { addBench, printout } from '../../src/bench';
import { getNow, initBenches, formatMs } from '../../src/utils';

import * as benchNamespace from './benchConstants';

const benches = initBenches();

addBench(
    'template strings vs string concatenation',
    () => {
        const iterations = 1_000_000;

        const concat1 = getNow();
        for (let i = 0; i < iterations; i++) {
            'key_' + i + '_value_' + i;
        }
        const concat2 = getNow();
        const template1 = getNow();

        for (let i = 0; i < iterations; i++) {
            `key_${i}_value_${i}`;
        }

        const template2 = getNow();

        return {
            concatenation: concat2 - concat1 + 'ms',

            'template strings': template2 - template1 + 'ms',
        };
    },
    benches,
);

addBench(
    'inline strings vs constant strings',
    () => {
        const iterations = 100_000;

        const inline1 = getNow();
        for (let i = 0; i < iterations; i++) {
            'huge string' + 'very long string';
        }

        const inline2 = getNow();

        const constants1 = getNow();
        for (let i = 0; i < iterations; i++) {}

        const constants2 = getNow();

        return {
            'inline strings': formatMs(inline2 - inline1),
            'constant strings': formatMs(constants2 - constants1),
        };
    },
    benches,
);

addBench(
    'strings from object vs strings from module namespace object',
    () => {
        const iterations = 100_000;

        const obj = { string1: 'huge string', string2: 'very long string' };

        const dObj1 = getNow();

        for (let i = 0; i < iterations; i++) {
            obj.string1 + obj.string2;
        }

        const dObj2 = getNow();

        const module1 = getNow();

        for (let i = 0; i < iterations; i++) {
            benchNamespace.string1 + benchNamespace.string2;
        }

        const module2 = getNow();

        return {
            'default object strings': formatMs(dObj2 - dObj1),
            'module namespace object string': formatMs(module2 - module1),
        };
    },
    benches,
);

addBench(
    'Array.prototype.join vs String concatenation',
    () => {
        const iterations = 1_000_000;

        const conc1 = getNow();
        let concatinated: string = '';
        for (let i = 0; i < iterations; i++) {
            concatinated += i;
        }
        const conc2 = getNow();

        const join1 = getNow();
        const array: string[] = [];
        for (let i = 0; i < iterations; i++) {
            array[array.length] = i.toString();
        }
        array.join();
        const join2 = getNow();

        return {
            'Array.prototype.join': formatMs(join2 - join1),
            'String concatenation': formatMs(conc2 - conc1),
        };
    },
    benches,
);

printout(benches);
