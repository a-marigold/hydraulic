import {
    addBench,
    BenchmarkResult,
    initBenches,
    now,
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

const trieVsBinarySearch = (): BenchmarkResult => {
    const i1 = now();
    for (let i = 0; i < 1_000_000; i++) {
        trie.insert(Math.floor(Math.random() * 1_000).toString() + i);
    }
    const i2 = now();

    warmup();

    const rs1 = now();
    const rsFound = trie.search('10');
    const rs2 = now();

    warmup();

    const is1 = now();
    const isFound = trie.search('10');
    const is2 = now();

    return {
        insertion: i2 - i1 + 'ms',
        'iterative search': is2 - is1 + 'ms',
        'recursive search': rs2 - rs1 + 'ms',
        // isFound: isFound.join(', '),
        // rsFound: rsFound.join(', '),
    };
};

const trie = new Trie();

const benchmarks = initBenches();

addBench('trie', trieVsBinarySearch, benchmarks);

printout(benchmarks);
