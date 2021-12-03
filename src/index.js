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

    //Middleware to get <form> data
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // Template engine
    app.engine('hbs', handlebars({
      extname: '.hbs'
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'resources/views'))

    // Handlebars register
    let hbs = handlebars.create({});
    // Keep selected value in pagination
    hbs.handlebars.registerHelper('select', function (selected, options) {
      return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
    });

    // Routes init
    route(app)

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })

  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  })