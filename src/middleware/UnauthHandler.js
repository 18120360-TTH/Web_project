const { uuid } = require('uuidv4')

module.exports = function (req, res, next) {
    if (!req.session.unauthId) {
        req.session.unauthId = uuid()
    }
    console.log("-----------------------------")
    console.log("Unauth ID = ", req.session.unauthId)
    console.log("-----------------------------")
    next()
}