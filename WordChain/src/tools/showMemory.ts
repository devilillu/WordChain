export function showMemory() {
    const formatMemoryUsage = (data: number) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
    const memoryData = process.memoryUsage();
    console.log(`rss: ${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - process execution`);
    console.log(`heapTotal: ${formatMemoryUsage(memoryData.heapTotal)} -> allocated heap`);
    console.log(`heapUsed: ${formatMemoryUsage(memoryData.heapUsed)} -> during the execution`);
    console.log(`external: ${formatMemoryUsage(memoryData.external)} -> V8 external memory`);
}
