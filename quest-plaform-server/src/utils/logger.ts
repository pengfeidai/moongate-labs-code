import { createLogger, format, transports, Logger } from 'winston';

const logger: Logger = createLogger({
  transports: [
    new transports.File({
      filename: 'logs/logging.log'
    })
  ],
  format: format.combine(
    format.label({ label: 'Log' }),
    format.timestamp({ format: 'DD-MMM-YYYY HH:mm:ss' }),
    format.printf(
      info => `${info.level}: ${info.label}: ${info.timestamp}: ${info.message}`
    )
  )
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}

const audit: Logger = createLogger({
  transports: [
    new transports.File({
      filename: 'logs/audit.log'
    })
  ],
  format: format.combine(
    format.label({ label: 'Audit' }),
    format.timestamp({ format: 'DD-MMM-YYYY HH:mm:ss' }),
    format.printf(
      info => `${info.level}: ${info.label}: ${info.timestamp}: ${info.message}`
    )
  )
});

if (process.env.NODE_ENV !== 'prod') {
  audit.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}

export { logger, audit };
