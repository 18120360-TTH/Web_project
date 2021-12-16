const { models } = require('../../config/db')
const sequelize = require('sequelize')

class CartServices {
    addBookToCart = (userID, book) => {
        return new Promise(async (resolve, reject) => {
            try {
                const bookInfo = await models.books.findByPk(book.book_id, { raw: true })

                await models.carts.create({
                    customer_username: userID,
                    book_id: book.book_id,
                    book_quantity: book.quantity,
                    total_cost: book.quantity * bookInfo.price
                }, { raw: true })

                resolve("Added " + book.quantity + " books into your cart!")
            }
            catch (err) {
                reject(err)
            }
        })
    }

    getCart = (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await models.carts.findAndCountAll({
                    raw: true,
                    // offset: offset,
                    // limit: 6,
                    where: { customer_username: userID },
                    include:
                    {
                        model: models.books,
                        as: 'book',
                        include: { model: models.images, as: 'images', where: { img_order: 1 } }
                    }
                })
                resolve({ books: cart.rows, count: cart.count })
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = new CartServices