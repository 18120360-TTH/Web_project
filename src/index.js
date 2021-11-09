const express = require('express')
const handlebars = require('express-handlebars');
const path = require('path')
const morgan = require('morgan')
const app = express()
const port = 3000

// Static file
app.use(express.static(path.join(__dirname, 'public')))

// HTTP logger
app.use(morgan('combined'))

// Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'))

// Routing
app.get('/', (req, res) => {res.render('index')})
app.get('/about-us', (req, res) => {res.render('about-us')})
app.get('/login', (req, res) => {res.render('login')})
app.get('/signup', (req, res) => {res.render('signup')})
app.get('/my-account', (req, res) => {res.render('my-account')})
app.get('/shop-grid-sidebar-left', (req, res) => {res.render('shop-grid-sidebar-left')})
app.get('/product-details-default', (req, res) => {res.render('product-details-default')})
app.get('/404', (req, res) => {res.render('404')})
app.get('/cart', (req, res) => {res.render('cart')})
app.get('/checkout', (req, res) => {res.render('checkout')})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})