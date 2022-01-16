const { models } = require('../models/index')
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
                    if (updateInfo[i] == 0) {
                        await models.carts.destroy({
                            where: {
                                customer_username: userID,
                                book_id: i
                            }
                        })
                    }
                    else {
                        console.log("Book = ", i, "Quantity = ", updateInfo[i])
                        await models.carts.update(
                            { book_quantity: parseInt(updateInfo[i]) },
                            {
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

    updateCartUser = (username, unauthID) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Get pre-login cart  
                const preCart = await models.carts.findAll({
                    raw: true,
                    where: { customer_username: unauthID }
                })

                // For each book in pre-login cart, check if it exists in post-login cart
                for (let i in preCart) {
                    const isExisted = await models.carts.findOne({
                        where: {
                            customer_username: username,
                            book_id: preCart[i].book_id
                        }
                    })

                    // If it exists, increment the quantity of this book
                    if (isExisted) {
                        await models.carts.update(
                            { book_quantity: parseInt(preCart[i].book_quantity) + parseInt(isExisted.book_quantity) },
                            {
                                raw: true,
                                where: {
                                    customer_username: username,
                                    book_id: preCart[i].book_id
                                }
                            }
                        )

                        // Delete this book in pre-login cart
                        await models.carts.destroy({
                            where: {
                                customer_username: unauthID,
                                book_id: preCart[i].book_id
                            }
                        })
                    }
                    // If it doesn't exist, change pre-login ID by username
                    else {
                        await models.carts.update(
                            { customer_username: username },
                            {
                                raw: true,
                                where: {
                                    customer_username: unauthID,
                                    book_id: preCart[i].book_id
                                }
                            }
                        )
                    }
                }
                resolve("Cart user update successfully!")
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

                if (cart) {
                    let fee = {}
                    fee.subTotal = 0
                    fee.itemsCount = 0
                    for (let i in cart.rows) {
                        fee.subTotal += cart.rows[i].total_cost
                        fee.itemsCount += cart.rows[i].book_quantity
                    }
                    fee.shipping = 20000 + fee.itemsCount * 1000
                    fee.total = fee.subTotal + fee.shipping

                    resolve({ books: cart.rows, count: cart.count, fee })
                }
                else {
                    resolve(null)
                }
            }
            catch (err) { reject(err) }
        })
    }

    proceedCart = (username, orderInfo) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await models.carts.findAll({
                    raw: true,
                    where: { customer_username: username }
                })

                if (cart) {
                    let fee = {}
                    fee.subTotal = 0
                    fee.itemsCount = 0
                    for (let i in cart) {
                        fee.subTotal += cart[i].total_cost
                        fee.itemsCount += cart[i].book_quantity
                    }
                    fee.shipping = 20000 + fee.itemsCount * 1000
                    fee.total = fee.subTotal + fee.shipping

                    const newOrderID = await models.orders.max('order_id') + 1

                    await models.orders.create({
                        order_id: newOrderID,
                        customer_username: username,
                        total_cost: fee.subTotal,
                        shipping_fee: fee.shipping,
                        payment_method: orderInfo.payment,
                        receiver_name: orderInfo.receiver,
                        customer_phone_number: orderInfo.phone,
                        customer_address: orderInfo.street + ', ' + orderInfo.city
                    })

                    for (let i in cart) {
                        await models.order_items.create({
                            order_id: newOrderID,
                            book_id: cart[i].book_id,
                            items_quantity: cart[i].book_quantity
                        })

                        await models.books.increment(
                            { quantity_in_stock: -cart[i].book_quantity },
                            { where: { book_id: cart[i].book_id } }
                        )

                        await models.carts.destroy({
                            where: {
                                customer_username: username,
                                book_id: cart[i].book_id
                            }
                        })
                    }
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            }
            catch (err) { reject(err) }
        })
    }

    countCart = (username) => {
        return new Promise(async (resolve, reject) => {
            try {
                const count = await models.carts.count({ where: { customer_username: username } })
                resolve(count)
            }
            catch (err) { reject(err) }
        })
    }
}

module.exports = new CartServices