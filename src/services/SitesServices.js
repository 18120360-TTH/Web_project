const { models } = require('../models/index')
const sequelize = require('sequelize')
const categories_of_book = require('../models/categories_of_book')

class SitesServices {
    updateProfile = (username, profile, avatar) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!profile.full_name || !profile.email || !profile.phone_number || !profile.address || !avatar) {
                    resolve("Service error: Some fields is blank!")
                }

                const avatar_url = '/images/users/' + avatar.filename

                console.log(avatar)
                console.log(avatar_url)

                const result = await models.users.update({
                    full_name: profile.full_name,
                    email: profile.email,
                    phone_number: profile.phone_number,
                    address: profile.address,
                    avatar_url: avatar_url
                }, {
                    raw: true,
                    where: { username: username, role: 'Customer' }
                })

                resolve(result)
            }
            catch (err) { reject(err) }
        })
    }

    getOrdersByUser = (username) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await models.orders.findAndCountAll({
                    raw: true,
                    where: { customer_username: username }
                })
                for (let i in result.rows) {
                    result.rows[i].order_date = result.rows[i].order_date.toDateString()
                }

                resolve(result.rows)
            }
            catch (err) { reject(err) }
        })
    }

    confirmEmail = (username) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await models.users.update({
                    verify_email: 1
                }, { where: { username: username } });

                resolve(result)
            }
            catch (err) { reject(err) }
        })
    }
}

module.exports = new SitesServices