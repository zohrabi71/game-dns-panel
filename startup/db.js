const mongoose = require('mongoose')
const config = require('config')
const dbConfig = config.get('dbConfig')
const { host, port, dbName } = dbConfig

module.exports = function mong() {
    mongoose
        .connect(`mongodb://${host}:${port}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
        .then(() => console.log('Database is connected.'))
        .catch(() => console.log('Database is disconnect.'))
}