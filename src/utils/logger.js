const { createLogger, format, transports } = require('winston')

module.exports = createLogger({
    format: format.combine(format.simple()),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            level: 'error',
            filename: `${__dirname}/../logs/error-api.log`
        }),
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            level: 'warn',
            filename: `${__dirname}/../logs/warn-api.log`
        }),
        new transports.Console({
            level: 'verbose',
        })
    ]
})