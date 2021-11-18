const productServices = require('./ProductServices')

class ProductsController {
    // [GET]  /products-list
    async shop(req, res) {
        const books = await productServices.list();
        res.render('products/products-list', {books})
    }

    // [GET] /products-list/{product-detail}
    detail(req, res) {
        res.render('products/product-detail')
    }
}

module.exports = new ProductsController
