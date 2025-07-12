const Controller = require("../controller");
const calculateRemainingTime = require('../../utils/calculateRemainingTime');

class dashboardController extends Controller {
    async dashboard(req, res) {
        let user = req.user
        let plan = null;
        const isAdmin = user.admin

        // Customer
        if (!isAdmin) {
            user.ip = req.ip
            user.remainingSubscription = calculateRemainingTime(user.subscription.end)
            
            if (user.payCash) {
                plan = await this.Plan.findById(user.payCash);
            }
        }
        
       

        res.status(200).render('dashboard/dashboard', { user, plan, msg: req.flash('msg') })
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