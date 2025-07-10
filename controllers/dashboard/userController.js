const Controller = require('../controller');
const bcrypt = require('bcryptjs');
const { body, validationResult, Result } = require('express-validator');

class userController extends Controller {
    // Get user 
    async get(req, res) {
        try {
            const userId = req.params.id;
            const user = await this.User.findById(userId);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const servers = await this.Server.find({});

            res.status(200).render('dashboard/user/edit', { servers, user, msg: '' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    // Update user 
    async update(req, res) {
        const { password, server, credit } = req.body;
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

            // Update credit if provided
            if (credit || credit === 0) user.credit = credit;

            // Save updated user
            await user.save();

            const servers = await this.Server.find({});

            res.status(200).render('dashboard/user/edit', { msg: 'اطلاعات کاربر با موفقیت بروزرسانی شد.', user, servers });
        } catch (err) {
            console.error(err.message);
            req.flash('errors', {
                param: 'server',
                msg: 'خطا در ذخیره سازی'
            });
            return res.redirect('dashboard/user/' + userId + '/edit');
        }
    }

    // Get all users
    async getAll(req, res) {
        try {
            const users = await this.User.find({ admin: false }).select('-password')

            res.status(200).render('dashboard/user/list', { users })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                msg: 'خطا در بازیابی اطلاعات',
                err: err.message
            })
        }
    }
}

module.exports = new userController()