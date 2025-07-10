const Controller = require('./controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult, Result } = require('express-validator');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const options = { hl: 'fa' };
const recaptcha = new Recaptcha(
    config.get('recaptcha').siteKey,
    config.get('recaptcha').secretKey,
    options
);

class AuthController extends Controller {
    async register(req, res) {
        // const recaptchaResult = await this.checkRecaptcha(req, res, '/auth/register');

        // if (!recaptchaResult) {
        //     return
        // }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/auth/register');
        }

        const { email, password } = req.body
        try {
            let user = await this.User.findOne({ email })

            if (user) {
                req.flash('errors', [
                    {
                        param: 'email',
                        msg: 'ایمیل وارد شده تکراری است.'
                    }
                ]);
                return res.redirect('/auth/register');
            }

            user = new this.User({
                email,
                password
            })

            const salt = bcrypt.genSaltSync(8)
            user.password = bcrypt.hashSync(password, salt)

            await user.save()

            const payload = {
                id: user._id
            }

            jwt.sign(payload, config.get('jwt_private'), { expiresIn: '24h' }, (err, token) => {
                if (err) throw err;
                res
                    .cookie('access_token', token, {
                        maxAge: 6 * 60 * 60 * 1000,
                        httpOnly: true,
                        sameSite: 'none',
                        secure: process.env.NODE_ENV === 'production',
                    })
                    .redirect('/dashboard')
            })
        } catch (err) {
            console.error(err.message);
            req.flash('errors', [
                {
                    param: 'server',
                    msg: 'خطا در ذخیره سازی'
                }
            ]);
            return res.redirect('/auth/register');
        }
    }

    async login(req, res) {
        // const recaptchaResult = await this.checkRecaptcha(req, res, '/auth/login');
        // if (!recaptchaResult) {
        //     return
        // }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/auth/login');
        }

        const { email, password } = req.body
        try {
            const user = await this.User.findOne({ email })
            if (!user) {
                req.flash('errors', { param: 'invalidInfo', msg: 'ایمیل یا پسورد غلط است.' })
                return res.redirect('/auth/login');
            }

            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                req.flash('errors', { param: 'invalidInfo', msg: 'ایمیل یا پسورد غلط است.' })
                return res.redirect('/auth/login');
            }

            const payload = {
                id: user._id
            }

            jwt.sign(payload, config.get('jwt_private'), { expiresIn: '6h' }, (err, token) => {
                if (err) throw err;
                res
                    .cookie('access_token', token, {
                        maxAge: 6 * 60 * 60 * 1000,
                        httpOnly: true,
                        sameSite: 'none',
                        secure: process.env.NODE_ENV === 'production',
                    })
                    .redirect('/dashboard')
            })
        } catch (err) {
            console.error(err.message);
            req.flash('errors', [
                {
                    param: 'server',
                    msg: 'خطا در بازیابی اطلاعات'
                }
            ]);
            return res.redirect('/auth/login');
        }
    }

    loginForm(req, res) {
        res.status(200).render('auth/login', { recaptcha: recaptcha.render() })
    }

    registerForm(req, res) {
        res.status(200).render('auth/register', { recaptcha: recaptcha.render() })
    }

    logoutForm(req, res) {
        res
            .status(200)
            .clearCookie('access_token')
            .redirect('/auth/login')
    }
}

module.exports = new AuthController()