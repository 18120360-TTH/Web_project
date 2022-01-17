const { models } = require('../models/index')
const bcrypt = require('bcrypt')

class AuthServices {
    findUser = (username) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await models.users.findOne({
                    raw: true,
                    where: {
                        username: username,
                        role: 'Customer'
                    }
                })

                resolve(result)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    addNewAccount = (accountInfo) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (await models.users.findByPk(accountInfo.username) != null) {
                    resolve(-1)
                } else if (accountInfo.password != accountInfo.password_rep) {
                    resolve(-2)
                }

                const result = await models.users.create({
                    username: accountInfo.username,
                    password_hashed: bcrypt.hashSync(accountInfo.password, 10),
                    full_name: (accountInfo.firstname + " " + accountInfo.lastname),
                    email: accountInfo.email,
                    avatar_url: '/images/users/avatar-0.png',
                    address: (accountInfo.address),
                    role: "Customer",
                    active: 1,
                    phone_number: accountInfo.phone_number
                }, { raw: true })

                resolve(result)
            }
            catch (err) { reject(err) }
        })
    }


    updatePassword = (username, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await models.users.update({
                    password_hashed: bcrypt.hashSync(password, 10),
                }, { where: { username: username } });

                resolve(result)
            }
            catch (err) { reject(err) }
        })
    }
}

module.exports = new AuthServices