const User = require('./../models/user');
const Payment = require('./../models/payment');
const Server = require('./../models/server');
const Plan = require('./../models/plan');
const config = require('config');
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const options = { hl: "fa" };
const recaptcha = new Recaptcha(
    config.get('recaptcha').siteKey,
    config.get('recaptcha').secretKey,
    options
);

class Controller {
    constructor() {
        this.User = User;
        this.Payment = Payment;
        this.Server = Server;
        this.Plan = Plan;
    }

    // hasCredit(expireTime) {
    //     const now = new Date().getTime()
    //     const distance = expireTime - now
    //     return (distance > 0) ? true : false;
    // }

    checkRecaptcha(req, res, url) {
        return new Promise((resolve, reject) => {
            recaptcha.verify(req, (err, data) => {
                if (err) {
                    req.flash('errors', [{param: 'recaptcha', msg: 'تیک گزینه امنیتی را بزنید'}]);
                    res.redirect(url);
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }
}

module.exports = Controller