const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const authServices = require('../services/AuthServices')
const cartServices = require('../services/CartServices')

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, async (req, username, password, done) => {
        try {
            // console.log("Password hashed--------------------------------------")
            // console.log(username, password)
            // console.log(await bcrypt.hash(password, 10))

            const userRecord = await authServices.findUser(username)
            userRecord.cartCount = await cartServices.countCart(username)

            if (userRecord && await bcrypt.compare(password, userRecord.password_hashed)) {
                if (userRecord.active != 1 || userRecord.verify_email != 1) {
                    return done(null, false)
                } else {
                    return done(null, userRecord)
                }
            } else {
                return done(null, false)
            }
        }
        catch (err) {
            return done(null, false)
        }
    }
    ))
}

passport.serializeUser((user, done) => {
    // console.log("passport.serializeUser----------------------")
    // console.log(user)
    done(null, {
        username: user.username,
        avatar_url: user.avatar_url,
        full_name: user.full_name,
        cart_count: user.cartCount
    })
})

passport.deserializeUser(async (user, done) => {
    try {
        // console.log("passport.deserializeUser----------------------")
        // console.log(user)
        const userRecord = await authServices.findUser(user.username)
        userRecord.cartCount = await cartServices.countCart(user.username)
        if (userRecord) {
            return done(null, {
                username: userRecord.username,
                avatar_url: userRecord.avatar_url,
                full_name: userRecord.full_name,
                cart_count: userRecord.cartCount
            })
        } else { return done(null, false) }
    }
    catch (err) { return done(null, false) }
    // console.log("passport.deserializeUser----------------------")
    // console.log(user)
    // done(null, user)
})

module.exports = initPassportLocal;