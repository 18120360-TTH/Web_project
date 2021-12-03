const { models } = require('../../config/db')
const sequelize = require('sequelize')
class ProductServices {
    getAllBooks = (page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 6
                const result = await models.books.findAndCountAll({
                    raw: true,
                    offset: offset,
                    limit: 6,
                    where: {
                        is_deleted: false
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
                    where: {
                        book_id: ID
                    }
                })
                resolve(authors)
            }
            catch (err) {
                reject(err)
            }
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
                const book = await models.books.findByPk(ID, {
                    raw: true,
                    where: { is_deleted: false }
                })
                await models.books.update({ view_times: book.view_times + 1 }, {
                    raw: true,
                    where: { book_id: ID }
                })
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
                    include: {
                        model: models.categories_of_book,
                        as: "categories_of_book",
                        where: {
                            category: category
                        }
                    }
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
                    where: { is_deleted: false }
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
                    optionQuery.include = [{
                        model: models.authors,
                        as: "authors",
                        where: { author_name: query.author }
                    }]
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
                    where: {
                        title: {
                            [sequelize.Op.substring]: keyword
                        }
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

    getSortedBooks(sort, page) {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 6

                let orderClause = {}
                if (sort == "title_a") {
                    orderClause = [['title', 'ASC']]
                }
                else if (sort == "title_z") {
                    orderClause = [['title', 'DESC']]
                }
                else if (sort == "best_sell") {
                    orderClause = [['sold', 'DESC']]
                }
                else if (sort == "most_view") {
                    orderClause = [['view_times', 'DESC']]
                }
                else if (sort == "released_year") {
                    orderClause = [['release_year', 'DESC']]
                }
                else if (sort == "low_price") {
                    orderClause = [['price', 'ASC']]
                }
                else if (sort == "high_price") {
                    orderClause = [['price', 'DESC']]
                }

                const result = await models.books.findAndCountAll({
                    raw: true,
                    offset: offset,
                    limit: 6,
                    order: orderClause
                })

                const sortedBooks = result.rows
                const count = result.count

                // console.log("-------------------------------------")
                // console.log(sortedBooks)
                // console.log("-------------------------------------")

                resolve({ sortedBooks, count })
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
                const book = await models.books.findByPk(ID, {
                    raw: true,
                    where: { is_deleted: false }
                })
                await models.books.update({ view_times: book.view_times + 1 }, {
                    raw: true,
                    where: { book_id: ID }
                })
                resolve(book)
            }
            catch (err) {
                reject(err)
            }
        })
    }

}

module.exports = new ProductServices
