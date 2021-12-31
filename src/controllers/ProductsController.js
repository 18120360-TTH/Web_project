const { query } = require('express')
const productServices = require('../services/ProductServices')

class ProductsController {
    // [GET]  /products-list
    async shop(req, res) {
        const page = (req.query.page == undefined) ? 1 : req.query.page

        const result = await productServices.getAllBooks(page)
        const books = result.books
        const count = result.count

        // Calculate number of resulted pages
        const totalPage = Math.ceil(count / 6)

        // If user access an invalid page
        if (req.query.page < 1 || req.query.page > totalPage || (isNaN(req.query.page) && req.query.page != undefined)) {
            res.render('errors/404')
        }

        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }

        // Use for filter
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
            // Use to indicate result order
            firstIndex: (page - 1) * 6 + 1,
            lastIndex: (page - 1) * 6 + books.length,
            count
        })
    }

    async category(req, res) {
        const page = (req.query.page == undefined) ? 1 : req.query.page

        const result = await productServices.getBooksByCategory(req.query.category, page)
        const books = result.categorizedBooks
        const count = result.count

        // Calculate number of resulted pages
        const totalPage = Math.ceil(count / 6)

        // If user access an invalid page
        if (req.query.page < 1 || req.query.page > totalPage || (isNaN(req.query.page) && req.query.page != undefined)) {
            res.render('errors/404')
        }

        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }

        const authorsList = await productServices.getAllAuthors()
        const publishersList = await productServices.getAllPublishers()

        let path = "/products-list/category?"
        for (let i in req.query) {
            if (i != 'page') {
                path += i + "=" + req.query[i] + "&"
            }
        }
        path += "page="

        res.render('products/products-list', {
            books,
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
            // Use to indicate result order
            firstIndex: (page - 1) * 6 + 1,
            lastIndex: (page - 1) * 6 + books.length,
            count,
            // Chosen category
            category: req.query.category
        })
    }

    async filter(req, res) {
        const page = (req.query.page == undefined) ? 1 : req.query.page

        const result = await productServices.getFilteredBook(req.query, page)
        const filteredBooks = result.filteredBooks
        const count = result.count

        // Calculate number of resulted pages
        const totalPage = Math.ceil(count / 6)

        // If user access an invalid page
        if (req.query.page < 1 || req.query.page > totalPage || (isNaN(req.query.page) && req.query.page != undefined)) {
            res.render('errors/404')
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
        let filterStatus = {}
        for (let i in req.query) {
            if (i != 'page') {
                path += i + "=" + req.query[i] + "&"
            }
            filterStatus[i] = req.query[i]
        }
        path += "page="

        filterStatus.min_price = req.query.min_price
        filterStatus.max_price = req.query.max_price

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
            // Use to indicate result order
            firstIndex: (page - 1) * 6 + 1,
            lastIndex: (page - 1) * 6 + filteredBooks.length,
            count: count,
            // Filter status
            filterStatus,
            search: req.query.search
        })
    }

    async search(req, res) {
        const page = (req.query.page == undefined) ? 1 : req.query.page

        const result = await productServices.getSearchedBooks(req.query.search, page)
        const searchedBooks = result.searchedBooks
        const count = result.count

        // Calculate number of resulted pages
        const totalPage = Math.ceil(count / 6)

        // If user access an invalid page
        if (req.query.page < 1 || req.query.page > totalPage || (isNaN(req.query.page) && req.query.page != undefined)) {
            res.render('errors/404')
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
            books: searchedBooks,
            // Use for filter
            authorsList,
            publishersList,
            // Use for pagination
            path: "/products-list/product-searched?page=",
            page,
            prePage: parseInt(page) - 1,
            nextPage: parseInt(page) + 1,
            lastPage: totalPage,
            isPreValid,
            isNextValid,
            // Use to indicate result order
            firstIndex: (page - 1) * 6 + 1,
            lastIndex: (page - 1) * 6 + searchedBooks.length,
            count: count,
            search: req.query.search
        })
    }

    // async adSearch(req, res) {
    //     let page
    //     const limit = 6
    //     if (req.query.page == undefined) { page = 1 }
    //     else { page = req.query.page }

    //     // console.log("--------------------------------")
    //     // console.log(req.query)

    //     const { searchedBooks, count } = await productServices.getAdSearchedBooks(req.query, page, limit)

    //     // Calculate number of resulted pages
    //     const totalPage = Math.ceil(count / limit)

    //     for (let i in searchedBooks) {
    //         const bookImgs = await productServices.getImagesByBook(searchedBooks[i].book_id)
    //         for (let j in bookImgs) {
    //             if (bookImgs[j].img_order == 1) {
    //                 searchedBooks[i].img_url = bookImgs[j].img_url
    //             }
    //         }
    //     }

    //     // On the first page, disable "Previous" and "First" button
    //     // On the last page, disable "Next" and "Last" button
    //     let isPreValid = true
    //     let isNextValid = true
    //     if (page == 1) { isPreValid = false }
    //     if (page == totalPage) { isNextValid = false }

    //     const authorsList = await productServices.getAllAuthors()
    //     const publishersList = await productServices.getAllPublishers()

    //     // let path = 
    //     // for (let i in req.query) {
    //     //     if (i != 'page') {
    //     //         path += i + "=" + req.query[i] + "&"
    //     //     }
    //     // }
    //     // path += "page="

    //     res.render('products/products-list', {
    //         books: searchedBooks,
    //         // Use for filter
    //         authorsList,
    //         publishersList,
    //         // Use for pagination
    //         path: "/products-list/advanced-searched?page=",
    //         page,
    //         prePage: parseInt(page) - 1,
    //         nextPage: parseInt(page) + 1,
    //         lastPage: totalPage,
    //         isPreValid,
    //         isNextValid,
    //         // Use to indicate result order
    //         firstIndex: (page - 1) * limit + 1,
    //         lastIndex: (page - 1) * limit + searchedBooks.length,
    //         count: count
    //     })
    // }

    // [GET] /products-list/products-sorted
    async sort(req, res) {
        const page = (req.query.page == undefined) ? 1 : req.query.page

        const result = await productServices.getSortedBooks(req.query, page)
        const books = result.sortedBooks
        const count = result.count

        // Calculate number of resulted pages
        const totalPage = Math.ceil(count / 6)

        // If user access an invalid page
        if (req.query.page < 1 || req.query.page > totalPage || (isNaN(req.query.page) && req.query.page != undefined)) {
            res.render('errors/404')
        }

        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }

        // Use for filter
        const authorsList = await productServices.getAllAuthors()
        const publishersList = await productServices.getAllPublishers()

        let path = "/products-list/product-sorted?"
        for (let i in req.query) {
            if (i != 'page') {
                path += i + "=" + req.query[i] + "&"
            }
        }
        path += "page="

        res.render('products/products-list', {
            books,
            // Use for filter
            authorsList,
            publishersList,
            // Use for pagination
            path: path,
            page,
            prePage: parseInt(page) - 1,
            nextPage: parseInt(page) + 1,
            lastPage: totalPage,
            isPreValid,
            isNextValid,
            // Use to indicate result order
            firstIndex: (page - 1) * 6 + 1,
            lastIndex: (page - 1) * 6 + books.length,
            count,
            // Sort status
            sortStatus: req.query.sort
        })
    }

    // [GET] /products-list/{product-detail}
    async detail(req, res) {
        const bookByID = await productServices.getBookByID(req.query.ID)
        const bookImgs = await productServices.getImagesByBook(req.query.ID)
        const bookAuthors = await productServices.getAuthorsByBook(req.query.ID)
        const relatedBooks = await productServices.getBooksByCategory(bookByID['categories_of_book.category'], 1)

        console.log(relatedBooks)

        // Add authors into book
        let authors = bookAuthors[0].author_name
        for (let i in bookAuthors) {
            if (i != 0) {
                authors += ", " + bookAuthors[i].author_name
            }
        }
        bookByID.authors = authors

        // Add imgs into book
        for (let i in bookImgs) {
            bookByID['img_' + bookImgs[i].img_order] = bookImgs[i].img_url
        }

        // Review
        const page = (req.query.page == undefined) ? 1 : req.query.page
        const bookReviews = await productServices.getReviewByBook(req.query.ID, page)

        // console.log(bookReviews)
        const totalPage = Math.ceil(bookReviews.count / 3)
        // On the first page, disable "Previous" and "First" button
        // On the last page, disable "Next" and "Last" button
        let isPreValid = true
        let isNextValid = true
        if (page == 1) { isPreValid = false }
        if (page == totalPage) { isNextValid = false }


        if (bookByID == null) { res.render('errors/404') }
        else {
            res.render('products/product-detail', {
                bookByID,
                bookReviews,
                relatedBooks: relatedBooks.categorizedBooks,
                // Use for pagination
                path: "/products-list/product-detail?ID=" + req.query.ID + "&page=",
                page,
                prePage: parseInt(page) - 1,
                nextPage: parseInt(page) + 1,
                lastPage: totalPage,
                isPreValid,
                isNextValid
            })
        }
    }

    // [POST] //products-list/product-detail?ID=
    async review(req, res) {
        const result = await productServices.reviewBook(req.query.ID, req.body)
        res.redirect('/products-list/product-detail?ID=' + req.query.ID)
    }
}

module.exports = new ProductsController
