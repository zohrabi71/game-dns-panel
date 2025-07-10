const Controller = require('../controller');
const bcrypt = require('bcryptjs');
const { body, validationResult, Result } = require('express-validator');

class serverController extends Controller {
    async createPage(req, res) {
        try {
            res.status(200).render('dashboard/server/create')
        } catch (err) {
            console.log(err)
        }
    }

    async set(req, res, next) {
        const { title, location, ip, status, capacity } = req.body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/dashboard/server/create');
        }

        try {
            let server = await this.Server.findOne({ ip })

            if (server) {
                req.flash('errors', [
                    {
                        param: 'server',
                        msg: 'سرور تکراری است.'
                    }
                ]);
                return res.redirect('/dashboard/server/create');
            }

            server = new this.Server({ title, location, ip, status, capacity })

            await server.save()

            req.flash('msg', 'سرور با موفقیت اضافه شد')
            res.redirect('/dashboard/server/' + server._id + '/edit');
        } catch (err) {
            console.error(err.message);
            req.flash('errors', [
                {
                    param: 'server',
                    msg: 'خطا در ذخیره سازی'
                }
            ]);
            return res.redirect('/dashboard/server/create');
        }
    }

    // Get server 
    async get(req, res) {
        try {
            const serverId = req.params.id;
            const server = await this.Server.findById(serverId);

            if (!server) {
                return res.status(404).json({ msg: 'Server not found' });
            }

            res.status(200).render('dashboard/server/edit', {
                server: server,
                msg: req.flash('msg')
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

    // Update server 
    async update(req, res) {
        const { title, location, ip, status, capacity } = req.body;
        const serverId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            return res.redirect('/dashboard/server/' + serverId + '/edit');
        }

        try {
            let server = await this.Server.findById(serverId);

            if (!server) {
                return res.status(404).json({ msg: 'Server not found' });
            }

            if (title) server.title = title;
            if (ip) server.ip = ip;
            if (location) server.location = location;
            if (status) server.status = status;
            if (capacity) server.capacity = capacity;

            // Save updated server
            await server.save();

            res.status(200).render('dashboard/server/edit', { msg: 'اطلاعات کاربر با موفقیت بروزرسانی شد.', server });
        } catch (err) {
            console.error(err.message);
            req.flash('errors', {
                param: 'server',
                msg: 'خطا در ذخیره سازی'
            });
            return res.redirect('dashboard/server');
        }
    }

    // Delete server 
    async delete(req, res) {
        const serverId = req.params.id;

        try {
            // Find the server by ID
            const server = await this.Server.findById(serverId);

            if (!server) {
                return res.status(404).json({ msg: 'Server not found' });
            }

            // Delete the server
            await server.remove();

            res.status(200).redirect('/dashboard/servers');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }


    // Get all servers
    async getAll(req, res) {
        try {
            const servers = await this.Server.find({});
            res.status(200).render('dashboard/server/list', { servers });
        } catch (err) {
            console.log(err);
            // Render the view with an error message
            res.status(500).render('dashboard/server/list', {
                servers: [], // Pass an empty array for servers
                msg: 'خطا در بازیابی اطلاعات: ' + err.message // Pass the error message to the EJS template
            });
        }
    }

}

module.exports = new serverController()