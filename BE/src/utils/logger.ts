type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: any;
}

function formatLog(level: LogLevel, message: string, meta?: Record<string, any>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
}

export const logger = {
  info(message: string, meta?: Record<string, any>) {
    console.log(JSON.stringify(formatLog('info', message, meta)));
  },

  warn(message: string, meta?: Record<string, any>) {
    console.warn(JSON.stringify(formatLog('warn', message, meta)));
  },

  error(message: string, meta?: Record<string, any>) {
    console.error(JSON.stringify(formatLog('error', message, meta)));
  },

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(JSON.stringify(formatLog('debug', message, meta)));
    }
  },
};
