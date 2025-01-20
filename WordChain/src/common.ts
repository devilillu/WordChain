export class WordChainRequest {
    constructor(
        public name: string, 
        public start: string,
        public end: string,
        public date: number) {}
}

export class WordChainEntry {
    constructor(
        public status?: RequestStatus,
        public name?: string, 
        public start?: string,
        public end?: string,
        public runtime?: number,
        public solutions?: string[],
        public shortests?: string[],
        public algorithm?: string,
        public error?: string,
        public id?: string) {}
}

export enum RequestStatus {
    Queued,
    Running,
    Complete
}
