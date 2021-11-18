
const productsRouter = require('./products')
const authRouter = require('./auth')
const cartRouter = require('./cart')
const errorsRouter = require('./errors')
const sitesRouter = require('./sites')

function route(app) { 
    app.use('/products-list', productsRouter)
    app.use('/auth', authRouter)
    app.use('/cart', cartRouter)
    app.use('/', sitesRouter)
    app.use('*', errorsRouter)
}

module.exports = route
