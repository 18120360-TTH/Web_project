const express = require('express')
const router = express.Router()
const errorsController = require('../controllers/ErrorsController')

router.use('/', errorsController.notFound)

module.exports = router