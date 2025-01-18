export function showMemory() {
    const formatMemoryUsage = (data: number) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
    const memoryData = process.memoryUsage();
    const memoryUsage = {
        rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution \n\r`,
        heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap \n\r`,
        heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution \n\r`,
        external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory \n\r`,
    };
    console.log(memoryUsage);
}
