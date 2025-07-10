const Controller = require('../controller');
const { body, validationResult, Result } = require('express-validator');

class planController extends Controller {
    async createPage(req, res) {
        try {
            res.status(200).render('dashboard/plan/create')
        } catch (err) {
            console.log(err)
        }
    }

    async set(req, res, next) {
        const { title, credit, price, discountedPrice, status } = req.body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/dashboard/plan/create');
        }

        try {
            let plan = await this.Plan.findOne({ credit })

            if (plan) {
                req.flash('errors', [
                    {
                        param: 'plan',
                        msg: 'پلن تکراری است.'
                    }
                ]);
                return res.redirect('/dashboard/plan/create');
            }

            plan = new this.Plan({ title, credit, price, discountedPrice, status })

            await plan.save()

            req.flash('msg', 'سرور با موفقیت اضافه شد')
            res.redirect('/dashboard/plan/' + plan._id + '/edit');
        } catch (err) {
            console.error(err.message);
            req.flash('errors', [
                {
                    param: 'plan',
                    msg: 'خطا در ذخیره سازی'
                }
            ]);
            return res.redirect('/dashboard/plan/create');
        }
    }

    // Get plan 
    async get(req, res) {
        try {
            const planId = req.params.id;
            const plan = await this.Plan.findById(planId);

            if (!plan) {
                return res.status(404).json({ msg: 'Plan not found' });
            }

            res.status(200).render('dashboard/plan/edit', {
                plan: plan,
                msg: req.flash('msg')
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Plan error');
        }
    }

    // Update plan 
    async update(req, res) {
        const { title, credit, price, discountedPrice, status } = req.body;
        const planId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/dashboard/plan/' + planId + '/edit');
        }

        try {
            let plan = await this.Plan.findById(planId);

            if (!plan) {
                return res.status(404).json({ msg: 'Plan not found' });
            }

            if (title) plan.title = title;
            if (price) plan.price = price;
            if (discountedPrice) plan.discountedPrice = discountedPrice;
            if (credit) plan.credit = credit;
            if (status) plan.status = status;

            // Save updated plan
            await plan.save();

            res.status(200).render('dashboard/plan/edit', { msg: 'اطلاعات کاربر با موفقیت بروزرسانی شد.', plan });
        } catch (err) {
            console.error(err.message);
            req.flash('errors', {
                param: 'server',
                msg: 'خطا در ذخیره سازی'
            });
            return res.redirect('/dashboard/plan/' + planId + '/edit');
        }
    }

    // Delete plan 
    async delete(req, res) {
        const planId = req.params.id;

        try {
            // Find the plan by ID
            const plan = await this.Plan.findById(planId);

            if (!plan) {
                return res.status(404).json({ msg: 'Plan not found' });
            }

            // Delete the plan
            await plan.remove();

            res.status(200).redirect('/dashboard/plans');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Plan error');
        }
    }


    // Get all plans
    async getAll(req, res) {
        try {
            const plans = await this.Plan.find({});
            res.status(200).render('dashboard/plan/list', { plans });
        } catch (err) {
            console.log(err);
            // Render the view with an error message
            res.status(500).render('dashboard/plan/list', {
                plans: [], // Pass an empty array for plans
                msg: 'خطا در بازیابی اطلاعات: ' + err.message // Pass the error message to the EJS template
            });
        }
    }

}

module.exports = new planController()