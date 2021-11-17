
class ProductsController {
    // [GET]  /products-list
    shop(req, res) {res.render('products/products-list')}

    // [GET] /products-list/{product-detail}
    detail(req, res) {res.render('products/product-detail')}
}

module.exports = new ProductsController
