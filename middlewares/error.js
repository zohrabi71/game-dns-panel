const logger = require('../logs/winston.config')

module.exports = (err, req, res, next) => {
    logger.log('error', err.message, err);
    res.status(500).json({ message: "خطای سمت سرور" })
}