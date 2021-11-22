// const { query } = require('express')
const productServices = require('./ProductServices')

class ProductsController {
    // [GET]  /products-list
    async shop(req, res) {
        // Calculate number of resulted pages
        const numOfResults = await productServices.countAllBooks()
        const totalPage = Math.ceil(numOfResults / 6)

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

        for (let i in books) {
            const bookImgs = await productServices.getBookImages(books[i].book_id)
            books[i].img_url = bookImgs[0].img_url

        }

        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }

        const authorsList = await productServices.getAllAuthors()
        const publishersList = await productServices.getAllPublishers()

        res.render('products/products-list', {
            books,
            // Use for filter
            authorsList,
            publishersList,
            // Use for pagination
            path: "/products-list?page=",
            page,
            prePage: parseInt(page) - 1,
            nextPage: parseInt(page) + 1,
            lastPage: totalPage,
            isPreValid,
            isNextValid,
            // Use to indicate results order
            firstIndex: (page - 1) * 6 + 1,
            lastIndex: (page - 1) * 6 + books.length,
            numOfResults
        })
    }

    async filter(req, res) {
        let page
        if (req.query.page == undefined) {
            page = 1
        }
        else {
            page = req.query.page
        }

        const result = await productServices.getFilteredBook(req.query, page)
        const filteredBooks = result.filteredBooks
        const numOfResults = result.count

        // Calculate number of resulted pages
        const totalPage = Math.ceil(numOfResults / 6)

        // If user access products-list without page

        // If user access an invalid page
        if (req.query.page < 1 || req.query.page > totalPage || (isNaN(req.query.page) && req.query.page != undefined)) {
            res.render('errors/404')
        }

        for (let i in filteredBooks) {
            const bookImgs = await productServices.getBookImages(filteredBooks[i].book_id)
            filteredBooks[i].img_url = bookImgs[0].img_url
        }

        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }

        const authorsList = await productServices.getAllAuthors()
        const publishersList = await productServices.getAllPublishers()

        let path = "/products-list/product-filtered?"
        for (let i in req.query) {
            if (i != 'page') {
                path += i + "=" + req.query[i] + "&"
            }
        }
        path += "page="

        // console.log("----------------")
        // console.log(path)
        // console.log("----------------")

        res.render('products/products-list', {

            books: filteredBooks,
            // Use for filter
            authorsList,
            publishersList,
            // Use for pagination
            path,
            page,
            prePage: parseInt(page) - 1,
            nextPage: parseInt(page) + 1,
            lastPage: totalPage,
            isPreValid,
            isNextValid,
            // Use to indicate results order
            firstIndex: (page - 1) * 6 + 1,
            lastIndex: (page - 1) * 6 + filteredBooks.length,
            numOfResults: numOfResults
        })
    }

    // [GET] /products-list/{product-detail}
    async detail(req, res) {
        const bookByID = await productServices.getBookByID(req.query.ID)
        const bookImgs = await productServices.getBookImages(req.query.ID)
        const bookAuthors = await productServices.getBookAuthors(req.query.ID)

        let authors = bookAuthors[0].author_name
        for (let i in bookAuthors) {
            if (i != 0) {
                authors += ", " + bookAuthors[i].author_name
            }
        }
        bookByID.authors = authors

        if (bookByID == null) {
            res.render('errors/404')
        }
        else {
            res.render('products/product-detail', { bookByID, bookImgs })
        }
    }
}

module.exports = new ProductsController
