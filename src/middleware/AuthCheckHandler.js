module.exports = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth/login')
    } else {
        // console.log(req.user)
        // res.locals.user = req.user
        next();
    }
}