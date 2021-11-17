const express = require('express')
const router = express.Router()
const errorsController = require('../app/controllers/ErrorsController')

router.use('/', errorsController.notFound)

module.exports = router