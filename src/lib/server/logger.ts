/**
 * Centralized logger using console (lightweight alternative)
 * In production, you can integrate with services like Sentry, LogRocket, etc.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

const logLevelEnv = (process.env.LOG_LEVEL || 'info') as LogLevel;
const currentLevel = levels[logLevelEnv];

const prefix: Record<LogLevel, string> = {
	debug: '🔵 [DEBUG]',
	info: '🟢 [INFO]',
	warn: '🟡 [WARN]',
	error: '🔴 [ERROR]'
};

class Logger {
	private context: string;

	constructor(context: string) {
		this.context = context;
	}

	private log(level: LogLevel, message: string, data?: unknown) {
		if (levels[level] < currentLevel) return;

		const timestamp = new Date().toISOString();
		const output = `${prefix[level]} [${timestamp}] ${this.context}: ${message}`;

		if (data) {
			console[level === 'error' ? 'error' : 'log'](output, data);
		} else {
			console[level === 'error' ? 'error' : 'log'](output);
		}
	}

	debug(message: string, data?: unknown) {
		this.log('debug', message, data);
	}

	info(message: string, data?: unknown) {
		this.log('info', message, data);
	}

	warn(message: string, data?: unknown) {
		this.log('warn', message, data);
	}

	error(message: string, data?: unknown) {
		this.log('error', message, data);
	}
}

export function createLogger(context: string): Logger {
	return new Logger(context);
}

export const logger = createLogger('Deporty');
