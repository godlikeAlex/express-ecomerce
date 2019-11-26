const Category = require('../models/category');
const errorHandler = require('../helpers/dbErrorHandler');

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save()
        .then(data => res.status(200).json({data}))
        .catch(err => res.status(400).json({"err": errorHandler(err)}));
};