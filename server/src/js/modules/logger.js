/**
 * Logger module providing standardized logging functionality
 */

// Logger object with different log levels
const logger = {
  info: (message) => {
    const now = new Date().toISOString();
    console.log(`${now} [INFO] ${message}`);
  },
  error: (message, error) => {
    const now = new Date().toISOString();
    console.error(`${now} [ERROR] ${message}`, error);
  },
  warn: (message) => {
    const now = new Date().toISOString();
    console.warn(`${now} [WARN] ${message}`);
  }
};

export default logger;

