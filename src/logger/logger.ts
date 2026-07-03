import { file } from "../tsimports";

type LogLevel = 'log' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
}

class Logger {
    private logDirectory: string = 'internal://files/logs/';
    private logFilePath: string;

    // 定义日志级别的样式
    private styles: { [key in LogLevel]: string } = {
        log: 'color: green;',
        warn: 'color: orange;',
        error: 'color: red;',
    };

    constructor() {
        const startTime = new Date().toISOString().replace(/[:.]/g, '-');
        this.logFilePath = `${this.logDirectory}log-${startTime}.log`;

        this.initializeLogDirectory();
    }

    private initializeLogDirectory() {
        const mkdirParams = {
            uri: this.logDirectory,
            recursive: true,
            success: () => console.log('Log directory created successfully'),
            fail: (err: any) => console.error('Failed to create log directory', err),
        };

        // @ts-ignore QuickApp API
        file.mkdir(mkdirParams);
    }

    public log(...args: any[]) {
        this.printAndStore('log', args);
    }

    public warn(...args: any[]) {
        this.printAndStore('warn', args);
    }

    public error(...args: any[]) {
        this.printAndStore('error', args);
    }

    private printAndStore(level: LogLevel, args: any[]) {
        const timestamp = new Date().toISOString();
        const style = this.styles[level];

        // 将所有参数序列化为字符串
        const message = args.map((arg) => this.safeStringify(arg)).join(' ');

        // 在控制台输出日志
        console.log(`%c[${timestamp}] [${level.toUpperCase()}] ${message}`, style);

        // 同步日志到文件
        this.flushLogToFile(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }

    private flushLogToFile(logEntry: string) {
        const writeParams = {
            uri: this.logFilePath,
            text: logEntry + '\n',
            append: true,
            fail: (err: any) => console.error('Failed to write log to file', err),
        };

        // @ts-ignore QuickApp API
        file.writeText(writeParams);
    }

    private safeStringify(obj: any): string {
        try {
            if (typeof obj === 'string') return obj;
            return JSON.stringify(obj, null, 2); // 美化输出
        } catch (err) {
            return '[Circular or Unsupported Object]';
        }
    }
}

const logger = new Logger();
export default logger;