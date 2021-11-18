const {models} = require('../../config/db');

exports.list = () => {
    return models.books.findAll({raw:true});
}