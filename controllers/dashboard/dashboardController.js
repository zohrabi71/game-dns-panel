const Controller = require("../controller");

class dashboardController extends Controller {
    async dashboard(req, res) {
        let user = req.user
        user.ip = req.ip
        const plan = await this.Plan.findById(user.payCash);

        res.status(200).render('dashboard/dashboard', { user, planCapacity: plan.capacity, msg: req.flash('msg') })
    }

    calculateCredit(expiredTime) {
        const now = new Date().getTime()
        const distance = expiredTime - now
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        return { days, hours, minutes, seconds }
    }
}

module.exports = new dashboardController()