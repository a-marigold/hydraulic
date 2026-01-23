export type BenchmarkResult = { [name: string]: string };

export type Benchmark = () => BenchmarkResult;

export type Benchmarks = Map<string, Benchmark>;
