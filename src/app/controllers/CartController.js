const { redirect } = require("express/lib/response")
const cartServices = require('./CartServices')

class CartController {
    // [GET]  /cart
    async cart(req, res) {
        const { books, count } = await cartServices.getCart(req.session.unauthId)
        console.log(books)
        res.render('cart/cart', { books })
    }

    // [GET] /cart/checkout
    checkout(req, res) { res.render('cart/checkout') }

    // [POST] /cart/add-items
    async addItems(req, res) {
        // console.log(req.body)
        const msg = await cartServices.addBookToCart(req.session.unauthId, req.body)
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }
}

module.exports = new CartController
