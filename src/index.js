require('dotenv').config()
const { sequelize } = require('./models')
const unauthHandler = require('./middleware/UnauthHandler')

sequelize.authenticate()
  .then(() => {
    //Database connected successfully
    console.log('Connection has been established successfully.')

    //Require library
    const express = require('express')
    const handlebars = require('express-handlebars')
    const path = require('path')
    const morgan = require('morgan')
    const passport = require('passport')
    const session = require('express-session')

    const route = require('./routes')

    const app = express()
    const PORT = process.env.PORT || 3000; //PORT to deploy in heroku

    // Static file
    app.use(express.static(path.join(__dirname, 'public')))

    // HTTP logger
    app.use(morgan('combined'))

    //Middleware to get <form> data
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // Authentication init
    app.use(session({
      secret: 'my_secret',
      cookie: { maxAge: 1000 * 60 * 60 * 24 }
    }))
    app.use(passport.initialize())
    app.use(passport.session())


    // Template engine
    app.engine('hbs', handlebars({ extname: '.hbs' }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'))

    // Handlebars register
    let hbs = handlebars.create({});
    // Keep selected value in pagination
    hbs.handlebars.registerHelper('select', function (selected, options) {
      return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
    });
    // Rating status
    hbs.handlebars.registerHelper('renderStars', (rating) => {
      let result = '';
      for (let i = 1; i <= 5; i++) {
        let checked = parseInt(rating) >= i ? 'fill' : 'empty';
        result += `<span class="mr-1 review-${checked}"><i class="fa fa-star"></i></span>`;
      }
      return new hbs.handlebars.SafeString(result);
    });
    // Switch case helper
    hbs.handlebars.registerHelper('switch', function (value, options) {
      this.switch_value = value;
      return options.fn(this);
    });
    hbs.handlebars.registerHelper('case', function (value, options) {
      if (value == this.switch_value) {
        return options.fn(this);
      }
    });


    app.use(unauthHandler)

    // Routes init
    route(app)

    /* app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    }) */
    
    app.listen(PORT, () => {
      console.log(`Our app is running on port ${ PORT }`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  })