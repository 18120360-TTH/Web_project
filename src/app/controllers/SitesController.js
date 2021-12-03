const authServices = require('./AuthServices')
const sitesServices = require('./SitesServices')
const multer = require('multer')
const path = require('path')

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

    // [POST] /my-account/profile-update
    async updateProfile(req, res) {
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, path.join(__dirname, '../../public/images/users'))
            },
            filename: function (req, file, callback) {
                callback(null, req.user.username + '_' + Date.now() + path.extname(file.originalname))
            }
        })

        const upload = multer({ storage: storage }).single('avatar')

        upload(req, res, async function (err) {
            await sitesServices.updateProfile(req.user.username, req.body, req.file)
        })

        res.redirect('/my-account')
    }
}

module.exports = new SitesController
