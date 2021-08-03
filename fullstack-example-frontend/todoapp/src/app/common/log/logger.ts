export interface Logger {
    logError(err: Error): void
    logError(errMsg: string): void
}
