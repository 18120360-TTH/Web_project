const AuthServices = require('../services/AuthServices')
const SendMailHandler = require('../middleware/SendMailHandler')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

JWT_KEY ='aiHQIfnb62JIFBEW!FioqwebeJCasd3!fj%3nfdhbDFdnsddf0yyeMMsdcG'

class AuthController {
    // [GET]  /login
    loginView(req, res) {
        if (req.query.failed) {
            res.render('auth/login', { msg: 'Username or password is incorrect!' })
        } else {
            res.render('auth/login')
        }
    }

    // [POST] /login
    login(req, res) {
        res.locals.user = req.user
        res.redirect('/')
    }

    // [GET] /logout
    logout(req, res) {
        req.logout()
        res.redirect('/')
    }

    // [GET]  /signup
    signup(req, res) { res.render('auth/signup') }

    // [GET]  /password-recovery
    pass_recover(req, res) { res.render('auth/password-recovery') }

    // [GET]  /password-reset
    pass_reset(req, res) { res.render('auth/password-reset') }

    // [POST] /create-account
    async create_account(req, res) {
        const result = await AuthServices.addNewAccount(req.body)
        
        //send confirm mail
        const username = req.body.username 
        const user_email = req.body.email
        let token = jwt.sign({username},JWT_KEY,{expiresIn: '1d'})
        const verify_url = process.env.DEPLOY_ENV + `/confirmation/${token}`;

        SendMailHandler({
            to: user_email,
            subject: 'Confirm Email',
            html: `Please click this email to confirm your email: <a href="${verify_url}">${verify_url}</a>`,
        });
        
        res.redirect('/verify-email')
    }

    
}

module.exports = new AuthController
