const multer = require('multer')
const path = require('path')
const jwt = require('jsonwebtoken')
const { resourceLimits } = require('worker_threads')
const authServices = require('../services/AuthServices')
const productServices = require('../services/ProductServices')
const sitesServices = require('../services/SitesServices')

class SitesController {
    // [GET]  /
    async home(req, res) {
        const { categorizedBooks } = await productServices.getBooksByCategory('Self-help', 1)
        for (let i in categorizedBooks) {
            const bookImgs = await productServices.getImagesByBook(categorizedBooks[i].book_id)
            for (let j in bookImgs) {
                if (bookImgs[j].img_order == 1) {
                    categorizedBooks[i].img_url = bookImgs[j].img_url
                }
            }
        }

        res.render('sites/index', { books: categorizedBooks })
    }

    // [GET]  /about-us
    about(req, res) { res.render('sites/about-us') }

    // [GET] /advanced-search
    ad_search(req, res) { res.render('sites/ad-search') }

    // [GET] /my-account
    async my_account(req, res) {
        const userInfo = await authServices.findUser(req.user.username)
        const orders = await sitesServices.getOrdersByUser(req.user.username)
        res.render('sites/my-account', { userInfo, orders })
    }

    // [POST] /my-account/profile-update
    async updateProfile(req, res) {
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, path.join(__dirname, '../public/images/users'))
            },
            filename: function (req, file, callback) {
                callback(null, req.user.username + '_' + Date.now() + path.extname(file.originalname))
            }
        })

        const upload = multer({ storage: storage }).single('avatar')

        upload(req, res, async function (err) {
            console.log(req.file)
            await sitesServices.updateProfile(req.user.username, req.body, req.file)
        })

        res.redirect('/my-account')
    }

    //[GET] /verify-email
    verifyEmailNotify(req, res) { res.render('sites/verify-email') }

    //[GET] /confirmation/:token
    async active_account(req, res) {
        const token = req.params.token
        try {
            const decoded = jwt.verify(token, JWT_KEY);
            const isVerify = sitesServices.confirmEmail(decoded.username)

        } catch (err) {
            console.log(err)
        }

        res.redirect('/auth/login')
    }


}

module.exports = new SitesController
