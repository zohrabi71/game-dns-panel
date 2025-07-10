const Controller = require("../controller");

class dashboardController extends Controller {
    async dashboard(req, res) {
        const user = req.user
        const expired = this.calculateCredit(user.expired)
        res.status(200).render('dashboard/dashboard', { user, expired })
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