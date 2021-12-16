const { models } = require('../../config/db')
const sequelize = require('sequelize')
const { NULL } = require('node-sass')

class CartServices {
    addBookToCart = (userID, book) => {
        return new Promise(async (resolve, reject) => {
            try {
                const bookInfo = await models.books.findByPk(book.book_id, { raw: true })

                const addedBook = await models.carts.findOne({
                    raw: true,
                    where: {
                        customer_username: userID,
                        book_id: book.book_id
                    }
                })

                if (addedBook) {
                    await models.carts.update(
                        { book_quantity: parseInt(addedBook.book_quantity) + parseInt(book.quantity) },
                        {
                            raw: true,
                            where: {
                                customer_username: userID,
                                book_id: book.book_id
                            }
                        })
                }
                else {
                    await models.carts.create({
                        customer_username: userID,
                        book_id: book.book_id,
                        book_quantity: book.quantity,
                        total_cost: book.quantity * bookInfo.price
                    }, { raw: true })

                }

                resolve("Added " + book.quantity + " books into your cart!")
            }
            catch (err) { reject(err) }
        })
    }

    updateCart = (userID, updateInfo) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("------------------------------------")
                console.log(updateInfo)
                console.log("------------------------------------")

                for (let i in updateInfo) {
                    console.log(updateInfo[i])
                    if (updateInfo[i] == 0) {
                        await models.carts.destroy({
                            where: {
                                customer_username: userID,
                                book_id: i
                            }
                        })
                    }
                    else {
                        await models.carts.update(
                            { book_quantity: updateInfo[i] },
                            {
                                raw: true,
                                where: {
                                    customer_username: userID,
                                    book_id: i
                                }
                            }
                        )
                    }
                }

                resolve("Updated successfully!")
            }
            catch (err) { reject(err) }
        })
    }


    getCart = (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await models.carts.findAndCountAll({
                    raw: true,
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
            catch (err) { reject(err) }
        })
    }
}

module.exports = new CartServices