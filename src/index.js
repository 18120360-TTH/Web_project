require('dotenv').config()
const { sequelize } = require('./config/db')

sequelize.authenticate()
  .then(() => {
    //Database connected successfully
    console.log('Connection has been established successfully.')

    //Require library
    const express = require('express')
    const handlebars = require('express-handlebars')
    const path = require('path')
    const morgan = require('morgan')
    const route = require('./routes')

    const app = express()
    const port = 3000

    // Static file
    app.use(express.static(path.join(__dirname, 'public')))

    // HTTP logger
    app.use(morgan('combined'))

    // Template engine
    app.engine('hbs', handlebars({
      extname: '.hbs'
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'resources/views'))

    // Routes init
    route(app)

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  })