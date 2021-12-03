const authServices = require('./AuthServices')

class SitesController {
    // [GET]  /
    home(req, res) { res.render('sites/index') }

    // [GET]  /about-us
    about(req, res) { res.render('sites/about-us') }

    // [GET] /advanced-search
    ad_search(req, res) { res.render('sites/ad-search') }

    // [GET] /my-account
    async my_account(req, res) {
        const userInfo = await authServices.findUser(req.user.username)
        res.render('sites/my-account', { userInfo })
    }
}

module.exports = new SitesController
