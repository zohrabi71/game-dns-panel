const Controller = require("./../controller");
const axios = require('axios');
const config = require('config');
const { body, validationResult, Result } = require('express-validator');

class paymentController extends Controller {
    async paymentPage(req, res) {
        const plans = await this.Plan.find({});
        const user = req.user

        res.status(200).render('dashboard/payment/create', { user, plans })
    }

    async pay(req, res, next) {
        // if (this.hasCredit(req.user.subscriptionExpiration)) {
        //     req.flash('errors', 'اعتبار شما هنوز به پایان نرسیده است.')
        //     return res.redirect('/dashboard');
        // }

        const plan = await this.Plan.findById(req.body.plan);
        if (!plan) {
            res.json('چنین پلنی وجود ندارد');
        }

        // if (req.user.checkpayCash(plan._id)) {
        //     res.json('این پلن را شما قبلا خریداری نموده اید')
        // }

        let params = {
            MerchantID: config.get('payment_token2'),
            Amount: plan.price,
            CallbackURL: "http://127.0.0.1:3000/dashboard/paycallback",
            Description: "افزایش اعتبار حساب کاربری ",
            Email: req.user.email,
        };

        try {
            const response = await axios.post("https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json", params);

            if (response.data.Status === 100) {
                const newPayment = new this.Payment({
                    user: req.user._id,
                    resnumber: response.data.Authority,
                    plan: plan._id,
                    amount: plan.price,
                })
                await newPayment.save();
                res.redirect(`https://www.zarinpal.com/pg/StartPay/${response.data.Authority}`);
            } else {
                res.redirect('/dashboard/payment')
            }
        } catch (err) {
            console.log(err.message)

            req.flash('errors', { param: 'server', msg: 'خطایی رخ داده!' });

            return res.redirect('/dashboard/payment')
        }
    }

    async payCallback(req, res, next) {
        try {
            // if (req.query.Status && req.query.Status !== 'OK') {
            //     return res.render('payment/paycallback', { msg: 'تراکنش ناموفق' })
            // }

            const payment = await this.Payment.findOne({ resnumber: req.query.Authority })

            // if (!payment) {
            //     return res.render('payment/paycallback', { msg: 'چنین تراکنشی وجود ندارد' });
            // }

            const params = {
                MerchantID: config.get('payment_token2'),
                Amount: payment.price,
                Authority: req.query.Authority,
            };

            const response = await axios.post("https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json", params);

            if (response.data.Status !== 100) {
                const user = await this.User.findById(payment.user)
                const plan = await this.Plan.findById(payment.plan)

                user.payCash = plan._id

                user.subscription.start = new Date();
                user.subscription.end = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);
                user.subscription.status = 'active';

                payment.status = 'completed'

                await user.save()
                await payment.save()

                res.render('dashboard/payment/paycallback', { msg: 'حساب کاربری شما با موفقیت شارژ شد.' });
            } else {
                payment.status = 'failed'
                await payment.save()

                return res.render('dashboard/payment/paycallback', { msg: 'تراکنش ناموفق' })
            }
        } catch (err) {
            console.log(err.message)
            next(err);
        }
    }

    // Get payment 
    async get(req, res) {
        try {
            const paymentId = req.params.id;
            const payment = await this.Payment.findById(paymentId);

            if (!payment) {
                return res.status(404).json({ msg: 'Payment not found' });
            }

            res.status(200).render('dashboard/payment/edit', {
                payment,
                msg: req.flash('msg')
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Payment error');
        }
    }

    // Update payment 
    async update(req, res) {
        const { status } = req.body;
        const paymentId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/dashboard/payment/' + paymentId + '/edit');
        }

        try {
            let payment = await this.Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({ msg: 'Payment not found' });
            }

            if (status) payment.status = status;

            // Save updated payment
            await payment.save();

            res.status(200).render('dashboard/payment/edit', { msg: 'اطلاعات پرداخت با موفقیت بروزرسانی شد.', payment });
        } catch (err) {
            console.error(err.message);
            req.flash('errors', {
                param: 'server',
                msg: 'خطا در ذخیره سازی'
            });
            return res.redirect('/dashboard/payment/' + paymentId + '/edit');
        }
    }

    // Get all payments
    async getAll(req, res) {
        try {
            const payments = await this.Payment.find({})
                .populate('user', 'email')
                .populate('plan', 'title')
                .sort({ updatedAt: -1 });

            res.status(200).render('dashboard/payment/list', { payments });
        } catch (err) {
            console.log(err);

            res.status(500).render('dashboard/payment/list', {
                payments: [],
                msg: 'خطا در بازیابی اطلاعات: ' + err.message
            });
        }
    }
}

module.exports = new paymentController()