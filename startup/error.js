const logger = require('../logs/winston.config')

module.exports = function errorOutOfRoute() {
    process.on('uncaughtException', (ex) => {
        console.log(ex.message);
        logger.log('error', ex.message, ex);
        process.exit(1);
    })

    process.on('unhandledRejection', (ex) => {
        console.log(ex.message);
        logger.log('error', ex.message, ex);
        process.exit(1);
    })
}