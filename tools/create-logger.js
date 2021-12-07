const winston = require('winston');

/**
 * This method creates a winston logger.
 * @param level The output level of the logger.
 */
function createLogger(level) {
  const myFormat = winston.format.printf(({level, message, timestamp}) => {
    // No timestamp (for logfile comparison)
    // return `${level} ${timestamp} : ${message}`;
    return `${level}: ${message}`;
  });

  const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.errors({stack: true}),
      winston.format.splat(),
      winston.format.timestamp()
    ),
    exitOnError: false, // do not exit on handled exceptions
    transports: [
      new winston.transports.Console({
        level,
        format: winston.format.combine(
          // put next line in comments if you want to tee the output (to avoid escape sequences in tee'd file)
          winston.format.colorize(),
          myFormat
        ),
        silent: !level
      })
    ]
  });

  return logger;
}

module.exports = createLogger;
