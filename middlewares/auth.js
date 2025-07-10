const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('./../models/user');

async function verifyToken(req, res, next) {
    const token = req.cookies.access_token

    if (!token) {
        req.flash('errors', [{ param: 'server', msg: 'توکن موجود نیست' }]);
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, config.get('jwt_private'))
        const user = await User.findById(decoded.id)
        
        if (!user) {
            req.flash('errors', [{ param: 'server', msg: 'توکن نامعتبر است.' }]);
            return res.redirect('/auth/login');
        }

        req.user = user
        next()
    } catch (error) {
        req.flash('errors', [{
            param: 'server',
            msg: 'خطا در برقراری با پایگاه داده: ' + error.message
        }]);
        return res.redirect('/auth/login');
    }
}

function checkCredit(req, res, next) {
    const expireTime = req.user.expired
    const now = new Date().getTime()
    const distance = expireTime - now
    if (distance <= 0) {
        return res.status(401).json({ msg: 'اعتبار شما پایان یافته است.' })
    }
    next()
}

module.exports = { verifyToken, checkCredit }