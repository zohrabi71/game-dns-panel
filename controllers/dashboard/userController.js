const Controller = require('../controller');
const bcrypt = require('bcryptjs');
const { body, validationResult, Result } = require('express-validator');
const calculateRemainingTime = require('../../utils/calculateRemainingTime');

class userController extends Controller {
    // Get user 
    async get(req, res) {
        try {
            const userId = req.params.id;
            let user = await this.User.findById(userId);
            user.subscriptionRemaining = calculateRemainingTime(user.subscription.end);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const servers = await this.Server.find({});

            res.status(200).render('dashboard/user/edit', { servers, user, msg: req.flash('msg') });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    // Update user 
    async update(req, res) {
        const { password, server, subscriptionRemaining } = req.body;
        const userId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/dashboard/user/' + userId + '/edit');
        }

        try {
            let user = await this.User.findById(userId);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Hash new password if provided
            if (password) {
                const salt = await bcrypt.genSalt(8);
                user.password = await bcrypt.hash(password, salt);
            }

            // Update server if provided
            if (server) user.server = server;

            // Calculate the expiration date
            const currentTime = new Date();
            const days = parseInt(subscriptionRemaining.days) || 0;
            const hours = parseInt(subscriptionRemaining.hours) || 0;
            const minutes = parseInt(subscriptionRemaining.minutes) || 0;
            const seconds = parseInt(subscriptionRemaining.seconds) || 0;

            // Calculate total milliseconds to add to the current time
            const totalMilliseconds =
                (days * 24 * 60 * 60 * 1000) +
                (hours * 60 * 60 * 1000) +
                (minutes * 60 * 1000) +
                (seconds * 1000);

            // Set the new subscription end date
            if (totalMilliseconds === 0) {
                user.subscription.status = 'disactive';
                user.subscription.end = null;
            } else {
                user.subscription.end = new Date(currentTime.getTime() + totalMilliseconds);
                user.subscription.status = 'active';
            }

            // Save updated user
            await user.save();

            req.flash('msg', 'اطلاعات کاربر با موفقیت بروزرسانی شد.');
            res.redirect('/dashboard/user/' + userId + '/edit');
        } catch (err) {
            console.error(err.message);
            req.flash('errors', {
                param: 'serverSide',
                msg: 'خطا در ذخیره سازی'
            });
            return res.redirect('/dashboard/user/' + userId + '/edit');
        }
    }

    // Get all users
    async getAll(req, res) {
        try {
            let users = await this.User.find({ admin: false }).select('-password')

            users = users.map(user => {
                const userDoc = user.toObject(); // Convert Mongoose document to plain object
                return {
                    ...userDoc,
                    remainingSubscription: calculateRemainingTime(userDoc.subscription.end)
                };
            });

            res.status(200).render('dashboard/user/list', { users })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                msg: 'خطا در بازیابی اطلاعات',
                err: err.message
            })
        }
    }

    // Set user IP
    async setIp(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/dashboard');
        }

        const { ips, id } = req.body;

        try {
            const updatedUser = await this.User.findByIdAndUpdate(
                id,
                { ips },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.flash('msg', 'آی پی با موفقیت ثبت شد.')

            res.redirect('/dashboard');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new userController()