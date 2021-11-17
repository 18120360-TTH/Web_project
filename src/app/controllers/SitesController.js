
class SitesController {
    // [GET]  /
    home(req, res) {res.render('sites/index')}

    // [GET]  /about-us
    about(req, res) {res.render('sites/about-us')}
    
    // [GET] /advanced-search
    ad_search(req, res) {res.render('sites/ad-search')}

    // [GET] /my-account
    my_account(req, res) {res.render('sites/my-account')}
}

module.exports = new SitesController
