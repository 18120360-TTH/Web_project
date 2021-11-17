
class AuthController {
    // [GET]  /login
    login(req, res) {res.render('auth/login')}

    // [GET]  /signup
    signup(req, res) {res.render('auth/signup')}

    // [GET]  /password-recovery
    pass_recover(req, res) {res.render('auth/password-recovery')}

    // [GET]  /password-reset
    pass_reset(req, res) {res.render('auth/password-reset')}
}

module.exports = new AuthController
