import { addBench, printout } from '../bench';
import { getNow, initBenches, warmup } from '../utils';

const benches = initBenches();

addBench('template strings vs string concatenation');

printout(benches);
