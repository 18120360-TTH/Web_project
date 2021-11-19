const productServices = require('./ProductServices')

class ProductsController {
    // [GET]  /products-list
    async shop(req, res) {
        // Calculate number of resulted pages
        const numOfResults = await productServices.countAllBooks()
        const totalPage = Math.ceil(numOfResults / 3)

        let page
        // If user access products-list without page
        if (req.query.page == undefined) {
            page = 1
        }
        // If user access an invalid page
        else if (req.query.page < 1 || req.query.page > totalPage || isNaN(req.query.page)) {
            res.render('errors/404')
        }
        else {
            page = req.query.page
        }
        // Get books list from database
        const books = await productServices.getAllBooks(page)

        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }

        res.render('products/products-list', {
            books,
            // Use for pagination
            page,
            prePage: parseInt(page) - 1,
            nextPage: parseInt(page) + 1,
            totalPage,
            isPreValid,
            isNextValid,
            // Use to indicate results order
            firstIndex: (page - 1) * 3 + 1,
            lastIndex: (page - 1) * 3 + books.length,
            numOfResults
        })
    }

    // [GET] /products-list/{product-detail}
    async detail(req, res) {
        const bookByID = await productServices.getBookByID(req.query.ID)
        if (bookByID == null) {
            res.render('errors/404')
        }
        else {
            res.render('products/product-detail', { bookByID })
        }
    }
}

module.exports = new ProductsController
