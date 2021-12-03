
class CartController {
    // [GET]  /cart
    cart(req, res) { res.render('cart/cart') }

    // [GET] /cart/checkout
    checkout(req, res) { res.render('cart/checkout') }
}

module.exports = new CartController
