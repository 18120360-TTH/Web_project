const { models } = require('../models/index')
const sequelize = require('sequelize')
const { category } = require('../controllers/ProductsController')
const categories_of_book = require('../models/categories_of_book')
class ProductServices {
    getAllBooks = (page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 6
                const result = await models.books.findAndCountAll({
                    raw: true,
                    offset: offset,
                    limit: 6,
                    where: { is_deleted: false },
                    include: {
                        model: models.images,
                        as: 'images',
                        where: { img_order: 1 }
                    }
                })
                const books = result.rows
                const count = result.count

                resolve({ books, count })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getImagesByBook = (ID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const imgs = await models.images.findAll({
                    raw: true,
                    where: {
                        book_id: ID
                    }
                })
                resolve(imgs)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getAuthorsByBook = (ID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const authors = await models.authors.findAll({
                    raw: true,
                    where: { book_id: ID }
                })
                resolve(authors)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getReviewByBook = (ID, page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { rows, count } = await models.reviews.findAndCountAll({
                    raw: true,
                    offset: (page - 1) * 3,
                    limit: 3,
                    where: { book_id: ID }
                })
                resolve({ rows, count })
            }
            catch (err) { reject(err) }
        })
    }

    getAllAuthors = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const authorsList = await models.authors.findAll({
                    raw: true,
                    attributes: [[sequelize.fn('DISTINCT', sequelize.col('author_name')), 'author']]
                })
                resolve(authorsList)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getAllPublishers = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const publishersList = await models.books.findAll({
                    raw: true,
                    attributes: [[sequelize.fn('DISTINCT', sequelize.col('publisher')), 'publisher']],
                    where: {
                        is_deleted: false
                    }
                })
                resolve(publishersList)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getAllCategories = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const categoriesList = await models.categories_of_book.findAll({
                    raw: true,
                    attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
                })
                resolve(categoriesList)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getBookByID = (ID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const book = await models.books.findOne({
                    raw: true,
                    where: {
                        book_id: ID,
                        is_deleted: false
                    },
                    include: {
                        model: models.categories_of_book,
                        as: "categories_of_book"
                    }
                })
                await models.books.update({ view_times: book.view_times + 1 }, {
                    raw: true,
                    where: { book_id: ID }
                })

                console.log(book)
                resolve(book)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getBooksByCategory = (category, page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 6
                const result = await models.books.findAndCountAll({
                    raw: true,
                    offset: offset,
                    limit: 6,
                    where: { is_deleted: false },
                    include: [
                        {
                            model: models.categories_of_book,
                            as: "categories_of_book",
                            where: { category: category }
                        },
                        {
                            model: models.images,
                            as: 'images',
                            where: { img_order: 1 }
                        }
                    ]
                })

                const categorizedBooks = result.rows
                const count = result.count

                resolve({ categorizedBooks, count })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getFilteredBook = (query, page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 6

                // Without filter attributes, get all books in database
                let optionQuery = {
                    raw: true,
                    offset: offset,
                    limit: 6,
                    where: { is_deleted: false },
                    include: [{
                        model: models.images,
                        as: 'images',
                        where: { img_order: 1 }
                    }]
                }

                // If any attribute is not equal to default value, add it to where clause
                if (query.min_price != 0 || query.max_price != 1000) {
                    optionQuery.where.price = {
                        [sequelize.Op.between]: [query.min_price * 1000, query.max_price * 1000]
                    }
                }
                if (query.publisher != "all") { optionQuery.where.publisher = query.publisher }
                if (query.language != "all") { optionQuery.where.language = query.language }

                // If author attribute is dedicated, add it to include clause
                if (query.author != "all") {
                    optionQuery.include[1] = {
                        model: models.authors,
                        as: "authors",
                        where: { author_name: query.author }
                    }
                }

                if (query.search) {
                    optionQuery.where.title = { [sequelize.Op.substring]: query.search }
                }

                // Query to the database
                const result = await models.books.findAndCountAll(optionQuery)
                const filteredBooks = result.rows
                const count = result.count

                resolve({ filteredBooks, count })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getSearchedBooks(keyword, page) {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 6
                const result = await models.books.findAndCountAll({
                    raw: true,
                    offset: offset,
                    limit: 6,
                    where: { title: { [sequelize.Op.substring]: keyword } },
                    include: {
                        model: models.images,
                        as: 'images',
                        where: { img_order: 1 }
                    }
                })

                const searchedBooks = result.rows
                const count = result.count

                resolve({ searchedBooks, count })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    // getAdSearchedBooks(keywords, page, limit) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let searchClause = {
    //                 raw: true,
    //                 offset: (page - 1) * limit,
    //                 limit: limit,
    //                 where: { is_deleted: false },
    //                 include: {
    //                     model: models.images,
    //                     as: 'images',
    //                     where: { img_order: 1 }
    //                 }
    //             }
    //             if (keywords.title) {
    //                 searchClause.where.title = {
    //                     [sequelize.Op.substring]: keywords.title
    //                 }
    //             }
    //             if (keywords.publisher) {
    //                 searchClause.where.publisher = {
    //                     [sequelize.Op.substring]: keywords.publisher
    //                 }
    //             }
    //             if (keywords.author) {
    //                 searchClause.include = {
    //                     model: models.authors,
    //                     as: 'authors',
    //                     where: { author_name: { [sequelize.Op.substring]: keywords.author } }
    //                 }
    //             }
    //             if (keywords.old_year && keywords.new_year) {
    //                 searchClause.where.release_year = {
    //                     [sequelize.Op.between]: [keywords.old_year, keywords.new_year]
    //                 }
    //             }

    //             const result = await models.books.findAndCountAll(searchClause)

    //             resolve({ searchedBooks: result.rows, count: result.count })
    //         }
    //         catch (err) { reject(err) }
    //     })
    // }

    getSortedBooks(query, page) {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 6

                let orderClause = {}
                if (query.sort == "title_a") {
                    orderClause = [['title', 'ASC']]
                }
                else if (query.sort == "title_z") {
                    orderClause = [['title', 'DESC']]
                }
                else if (query.sort == "best_sell") {
                    orderClause = [['sold', 'DESC']]
                }
                else if (query.sort == "most_view") {
                    orderClause = [['view_times', 'DESC']]
                }
                else if (query.sort == "released_year") {
                    orderClause = [['release_year', 'DESC']]
                }
                else if (query.sort == "low_price") {
                    orderClause = [['price', 'ASC']]
                }
                else if (query.sort == "high_price") {
                    orderClause = [['price', 'DESC']]
                }

                let whereClause = {}
                if (query.search) { whereClause.title = { [sequelize.Op.substring]: query.search } }

                const result = await models.books.findAndCountAll({
                    raw: true,
                    offset: offset,
                    limit: 6,
                    order: orderClause,
                    where: whereClause,
                    include: {
                        model: models.images,
                        as: 'images',
                        where: { img_order: 1 }
                    }
                })

                const sortedBooks = result.rows
                const count = result.count

                resolve({ sortedBooks, count })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    reviewBook(ID, review) {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log("-------------------------------------")
                // console.log(ID, review)
                // console.log("-------------------------------------")
                const result = await models.reviews.create({
                    customer_username: review.name,
                    book_id: ID,
                    rating: review.rate,
                    comment: review.comment
                }, { raw: true })


                resolve(result)
            }
            catch (err) { reject(err) }
        })
    }
}

module.exports = new ProductServices
