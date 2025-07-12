const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override')


module.exports = function (app, express) {
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.static('public'))
    app.set('view engine', 'ejs')
    app.use(methodOverride('_method'))

    app.use(session({
        secret: 'g14g5h3h3huil8bdb55',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3 * 60 * 60 * 1000 }
    }))
    app.use(flash());
}