import {
    addBench,
    BenchmarkResult,
    initBenches,
    getNow,
    printout,
    warmup,
} from '..';

type TrieNode = { children: { [key: string]: TrieNode }; isWord: boolean };

class Trie {
    #root: TrieNode;

    constructor() {
        this.#root = { children: {}, isWord: false };
    }

    insert(word: string): void {
        let node = this.#root;

        const wordLength = word.length;

        let index = 0;
        while (index < wordLength) {
            const char = word[index];
            const children = node.children;

            if (!children[char]) {
                children[char] = { children: {}, isWord: false };
            }

            node = children[char];

            ++index;
        }

        node.isWord = true;
    }

    search(prefix: string): string[] {
        let node = this.#root;

        const prefixLength = prefix.length;

        let index = 0;

        while (index < prefixLength) {
            const char = prefix[index];
            const children = node.children;

            if (children[char]) {
                node = children[char];

                index++;
            } else {
                return [];
            }
        }

        return this.#iterativeCollect(node, prefix);
    }

    recursiveSearch(prefix: string): string[] {
        let node = this.#root;

        const prefixLength = prefix.length;

        let index = 0;

        while (index < prefixLength) {
            const char = prefix[index];

            if (!node.children[char]) {
                return [];
            }

            node = node.children[char];

            ++index;
        }

        const words: string[] = [];

        this.#recursiveCollect(node, prefix, words);

        return words;
    }

    #recursiveCollect(node: TrieNode, prefix: string, words: string[]): void {
        if (node.isWord) {
            words[words.length] = prefix;
        }

        const children = node.children;

        for (const char in children) {
            this.#recursiveCollect(children[char], prefix + char, words);
        }
    }

    #iterativeCollect(node: TrieNode, prefix: string): string[] {
        const words: string[] = [];

        const stack: { node: TrieNode; prefix: string }[] = [{ node, prefix }];

        let index = 0;
        while (index < stack.length) {
            const currentNode = stack[index++];

            if (currentNode.node.isWord) {
                words[words.length] = currentNode.prefix;
            }

            for (const char in currentNode.node.children) {
                stack[stack.length] = {
                    node: currentNode.node.children[char],

                    prefix: currentNode.prefix + char,
                };
            }
        }

        return words;
    }
}

class BinarySearchArray<T = unknown> {
    array: T[];

    #compareFn: (value: T) => string | number;

    #sortCompareFn: (a: T, b: T) => number;

    constructor(
        compareFn: (value: T) => string | number,

        entries: { array?: T[]; sortCompareFn: (a: T, b: T) => number },
    ) {
        this.array = entries.array?.sort(entries.sortCompareFn) ?? [];

        this.#compareFn = compareFn;

        this.#sortCompareFn = entries.sortCompareFn;
    }

    insert(value: T) {
        const lowerBound = this.findLowerBound(value);

        this.array = this.array.sort(this.#sortCompareFn);
    }

    indexOf(value: T): number {
        const comparedValue = this.#compareFn(value);

        let leftIndex = 0;
        let rightIndex = this.array.length - 1;

        while (leftIndex <= rightIndex) {
            const middleIndex = (leftIndex + rightIndex) >> 1;
            const comparedMiddle = this.#compareFn(this.array[middleIndex]);

            if (comparedMiddle === comparedValue) {
                return middleIndex;
            } else if (comparedMiddle < comparedValue) {
                leftIndex = middleIndex + 1;
            } else {
                rightIndex = middleIndex - 1;
            }
        }

        return -1;
    }

    findLowerBound(value: T): number {
        const comparedValue = this.#compareFn(value);

        let leftIndex = 0;
        let rightIndex = this.array.length;

        while (leftIndex < rightIndex) {
            const middleIndex = (leftIndex + rightIndex) >> 1;

            const comparedMiddle = this.#compareFn(this.array[middleIndex]);

            if (comparedMiddle < comparedValue) {
                leftIndex = middleIndex + 1;
            } else {
                rightIndex = middleIndex;
            }
        }

        return leftIndex;
    }
}

Bun.stdout.write(
    String(
        new BinarySearchArray<string>((value) => value, {
            array: [
                'bca',
                'abc',
                'str',
                'boadfd',
                'adbr',
                'asdoc',
                'cat',
                'cats',
                'car',
            ],
            sortCompareFn: (a, b) => a.localeCompare(b),
        }).indexOf('abc'),
    ) + '\n',
);

const trieVsBinarySearch = (): BenchmarkResult => {
    const trie = new Trie();

    const trieIns1 = getNow();
    for (let i = 0; i < 1_000_000; i++) {
        trie.insert(i.toString());
    }
    const trieIns2 = getNow();

    const trieRec1 = getNow();
    const rsFound = trie.search('10');
    const trieRec2 = getNow();

    const trieIter1 = getNow();
    const isFound = trie.recursiveSearch('10');
    const trieIter2 = getNow();

    const bsa = new BinarySearchArray<string>((value) => value, {
        sortCompareFn: (a, b) => a.localeCompare(b),
    });

    const bsaIns1 = getNow();
    for (let i = 0; i < 1_000_000; i++) {
        bsa.insert(i.toString());
    }

    const bsaIns2 = getNow();

    const bsaSearch1 = getNow();
    bsa.indexOf('600000');
    const bsaSearch2 = getNow();

    return {
        'trie insertion': trieIns2 - trieIns1 + 'ms',
        'trie iterative search': trieIter2 - trieIter1 + 'ms',
        'trie recursive search': trieRec2 - trieRec1 + 'ms\n',
        'binary search array insertion': bsaIns2 - bsaIns1 + 'ms',
        'binary search array search': bsaSearch2 - bsaSearch1 + 'ms',
    };
};

const benchmarks = initBenches();

addBench('trie vs BSA', trieVsBinarySearch, benchmarks);

printout(benchmarks);
