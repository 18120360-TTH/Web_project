const { models } = require('../../config/db')
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

                const result = await models.users.update({
                    full_name: profile.full_name,
                    email: profile.email,
                    phone_number: profile.phone_number,
                    address: profile.address,
                    avatar_url: avatar_url
                }, {
                    raw: true,
                    where: { username: username, role: 'Admin' }
                })

                resolve(result)
            }
            catch (err) { reject(err) }
        })
    }

    // randomBook = (category) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const books = await models.books.findAndCountAll({
    //                 raw: true,
    //                 limit: 4,
    //                 where: { is_deleted: false }
    //             })

    //             resolve(books)
    //         }
    //         catch (err) { reject(err) }
    //     })
    // }
}

module.exports = new SitesServices