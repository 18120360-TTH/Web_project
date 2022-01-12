const cartServices = require('../services/CartServices')

module.exports = async function (req, res, next) {
    res.locals.user = req.user
    if (!req.user) {
        res.locals.cart_count = await cartServices.countCart(req.session.unauthId)
    }
    next();
}