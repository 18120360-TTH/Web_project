const { models } = require('../../config/db')
const sequelize = require('sequelize')

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
            catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = new SitesServices