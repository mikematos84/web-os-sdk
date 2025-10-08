import { CONSOLE_LOG_PREFIX } from "../constants"

export interface Logger {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
}

export const logger: Logger =          {
    log: (...args: any[]) => console.log(CONSOLE_LOG_PREFIX, ...args),
    warn: (...args: any[]) => console.warn(CONSOLE_LOG_PREFIX, ...args),
    error: (...args: any[]) => console.error(CONSOLE_LOG_PREFIX, ...args),
    info: (...args: any[]) => console.info(CONSOLE_LOG_PREFIX, ...args),
};