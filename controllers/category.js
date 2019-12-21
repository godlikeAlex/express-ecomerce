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
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({"err": errorHandler(err)})
        }

        return res.status(200).json({data})
    });
};

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save()
        .then( () => {return res.status(200).json({msg: 'Category updated'})} )
        .catch( err => {return res.status(400).json({err: errorHandler(err)})});
};

exports.list = (req, res) => {
    Category.find().exec()
        .then(data => {res.status(200).json(data)})
        .catch(err => {return res.status(400).json({err: errorHandler(err)})});
};

exports.read = (req, res) => {
    return res.json(req.category);
};

exports.remove = (req, res) => {
    const category = req.category;
    category.remove()
        .then( () => {return res.status(200).json({msg: 'Category deleted'})} )
        .catch( err => {return res.status(400).json({err: errorHandler(err)})});
};