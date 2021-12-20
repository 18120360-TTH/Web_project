
const productsRouter = require('./ProductsRouter')
const authRouter = require('./AuthRouter')
const cartRouter = require('./CartRouter')
const errorsRouter = require('./ErrorsRouter')
const sitesRouter = require('./SitesRouter')
const resLocal = require('../middleware/ResLocalHandler')

function route(app) {
    app.use(resLocal)
    app.use('/auth', authRouter)
    app.use('/products-list', productsRouter)
    app.use('/cart', cartRouter)
    app.use('/', sitesRouter)
    app.use('*', errorsRouter)
}

module.exports = route
