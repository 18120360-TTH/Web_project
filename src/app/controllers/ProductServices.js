const { models } = require('../../config/db')

class ProductServices {
    getAllBooks = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const books = models.books.findAll({ raw: true })
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
