import { addBench, printout } from '../bench';
import { BenchmarkResult } from '../types';
import { getNow, initBenches, warmup } from '../utils';

const bubbleSort = (array: number[]): number[] => {
    const arrayLength = array.length;

    let outerIndex = 0;

    let swapped = false;

    while (outerIndex < arrayLength) {
        let index = 0;

        while (index < arrayLength) {
            if (array[index] > array[index + 1]) {
                const temporaryMin = array[index];
                array[index] = array[index + 1];
                array[index + 1] = temporaryMin;
                swapped = true;
            }
            if (!swapped) {
                return array;
            }

            index++;
        }

        outerIndex++;
    }

    return array;
};

const quickSort = (array: number[]): number[] => {
    const arrayLength = array.length;

    if (arrayLength <= 1) {
        return array;
    }

    const pivotIndex = Math.floor(arrayLength / 2);

    const pivot = array[pivotIndex];

    const leftArray: number[] = [];
    const rightArray: number[] = [];

    let index = 0;
    while (index < arrayLength) {
        if (index === pivotIndex) {
            ++index;

            continue;
        }

        if (array[index] < pivot) {
            leftArray[leftArray.length] = array[index];
        } else {
            rightArray[rightArray.length] = array[index];
        }

        ++index;
    }

    return [...quickSort(leftArray), pivot, ...quickSort(rightArray)];
};

const hoarSort = (
    array: number[],
    left = 0,
    right = array.length - 1,
): number[] => {
    const arrayLength = array.length;

    const pivot = array[Math.floor(arrayLength / 2)];

    let i = left;
    let j = right;

    while (true) {
        while (array[i] < pivot) {
            i++;
        }
        while (array[j] > pivot) {
            j--;
        }

        if (i <= j) {
            const temporaryMin = array[i];
            array[i] = array[j];
            array[j] = temporaryMin;
        }
    }
};

const bubbleVsQuick = (): BenchmarkResult => {
    const array = [
        3, 2, 6, 10, 7, 16, 17, 19, 20, 21, 3, 2, 6, 10, 7, 16, 17, 19, 20, 21,
        3, 2, 6, 10, 7, 16, 17, 19, 20, 21,
    ];

    warmup();

    const b1 = getNow();
    bubbleSort(array);
    const b2 = getNow();

    warmup();

    const q1 = getNow();
    quickSort(array);
    const q2 = getNow();

    const result: BenchmarkResult = {
        bubble: b2 - b1 + 'ms',
        quick: q2 - q1 + 'ms',
    };

    return result;
};

const benchmarks = initBenches();

addBench('bubble sort vs quick sort', bubbleVsQuick, benchmarks);

printout(benchmarks);
