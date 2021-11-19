const { models } = require('../../config/db')

class ProductServices {

    countAllBooks = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const amount = models.books.count()
                resolve(amount)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getAllBooks = (page) => {
        return new Promise(async (resolve, reject) => {
            try {
                const offset = (page - 1) * 3
                const books = models.books.findAll({ raw: true, offset: offset, limit: 3 })
                resolve(books)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getBookByID = (ID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const book = models.books.findByPk(ID, { raw: true })
                resolve(book)
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = new ProductServices
