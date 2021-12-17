const { redirect } = require("express/lib/response")
const cartServices = require('./CartServices')

class CartController {
    // [GET]  /cart
    async cart(req, res) {
        let cartUser
        if (req.isAuthenticated()) {
            cartUser = req.user.username
        }
        else {
            cartUser = req.session.unauthId
        }
        const result = await cartServices.getCart(cartUser)

        let books, fee
        if (!result) {
            books = fee = null
        } else {
            books = result.books
            fee = result.fee
        }
        res.render('cart/cart', { books, fee })
    }

    // [GET] /cart/checkout
    checkout(req, res) { res.render('cart/checkout') }

    // [POST] /cart/add-items
    async addItems(req, res) {
        let cartUser
        if (req.isAuthenticated()) {
            cartUser = req.user.username
        }
        else {
            cartUser = req.session.unauthId
        }
        const msg = await cartServices.addBookToCart(cartUser, req.body)
        console.log(msg)
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }

    // [POST] /cart/update-items
    async updateItems(req, res) {
        let cartUser
        if (req.isAuthenticated()) {
            cartUser = req.user.username
        }
        else {
            cartUser = req.session.unauthId
        }
        const msg = await cartServices.updateCart(cartUser, req.body)
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }

    async mergeCart(req, res, next) {
        const msg = await cartServices.updateCartUser(req.user.username, req.session.unauthId)
        next()
    }
}

module.exports = new CartController
