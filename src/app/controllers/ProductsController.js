const productServices = require('./ProductServices')

class ProductsController {
    // [GET]  /products-list
    async shop(req, res) {
        const books = await productServices.getAllBooks();
        res.render('products/products-list', {books})
    }

    // [GET] /products-list/{product-detail}
    async detail(req, res) {
        const bookByID = await productServices.getBookByID(req.query.ID)
        if (bookByID==null) {
            res.render('errors/404')
        }
        else {
            res.render('products/product-detail', {bookByID})
        }
    }
}

module.exports = new ProductsController
