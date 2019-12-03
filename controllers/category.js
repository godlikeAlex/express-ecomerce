const Category = require('../models/category');
const errorHandler = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(200).json({'err': 'Category not found'});
        }
        req.category = category;
        next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save()
        .then(data => res.status(200).json({data}))
        .catch(err => res.status(400).json({"err": errorHandler(err)}));
};

exports.read = (req, res) => {
    return res.json(req.category);
};