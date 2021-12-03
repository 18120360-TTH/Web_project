const AuthServices = require('./AuthServices')
const bcrypt = require('bcrypt');

class AuthController {
    // [GET]  /login
    login(req, res) {res.render('auth/login')}

    // [GET]  /signup
    signup(req, res) {res.render('auth/signup')}

    // [GET]  /password-recovery
    pass_recover(req, res) {res.render('auth/password-recovery')}

    // [GET]  /password-reset
    pass_reset(req, res) {res.render('auth/password-reset')}

    // [POST]  /signup/new-account
    async create_account(req,res){
        const saltRounds = 10;  //Cost factor; higher the cost factor, the more difficult to brute-force
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        const isAddingAccount = await AuthServices.addNewAccount(req.body)
        res.redirect('/auth/login') 
    }
}

module.exports = new AuthController
