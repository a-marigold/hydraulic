export type BenchmarkResult = { name: string; value: string };

export type Benchmark = () => BenchmarkResult[];

export type Benchmarks = Map<string, Benchmark>;
