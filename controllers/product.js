const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const errorHandler = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
        if (err || !product) {
          return res.status(404).json({err: 'Required product not found.'});
        }
        req.product = product;
        next();
  });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    console.log(req.body);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) return res.status(400).json({err: "Image cloud not be uploaded"});

        const { name, description, price, category, shipping, quantity, photo } = fields;

        if(!name || !description || !price || !category || !shipping || !quantity) {
            return res.status(400).json({err: "Missing required fields."});
        }

        const createdProduct = new Product(fields);
        if(files.photo) {
            if(files.photo.size > 300000) {
                return  res.status(400).json({err: "Image should be less then 1mb."});
            }
            createdProduct.photo.data = fs.readFileSync(files.photo.path);
            console.log(files.photo.path);
            createdProduct.photo.contentType = files.photo.type;
        }
        createdProduct.save()
            .then(data => { return res.status(200).json(createdProduct) })
            .catch(err => { return res.json(400).json({err: errorHandler(err)}) })
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) return res.status(400).json({err: "Something went wrong"});

        let createdProduct = req.product;
        createdProduct = _.extend(createdProduct, fields);

        if(files.photo) {
            if(files.photo.size > 300000) {
                return  res.status(400).json({err: "Image should be less then 1mb."});
            }
            createdProduct.photo.data = fs.readFileSync(files.photo.path);
            console.log(files.photo.path);
            createdProduct.photo.contentType = files.photo.type;
        }
        createdProduct.save()
            .then(data => { return res.status(200).json(createdProduct) })
            .catch(err => { return res.json(400).json({err: errorHandler(err)}) })
    });
};

exports.remove = (req, res) => {
    const product = req.product;
    product.remove()
        .then(() => res.status(200).json({message: "Product deleted"}))
        .catch(err => res.status(400).json({err: errorHandler(err)}));
};

/**
 *  sell / arrival
 *  by sold = /products?sortBy=sold&order=desc&limit=number
 *  by arrival = /products?sortBy=createdAt&order=desc&limit=number
 *  if params not sent, then all products are returned.
 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'desc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : null;

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if(err && !data) {
                return res.status(400).json({err: 'Products not found'});
            }

            return res.status(200).send(data);
        });
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if(err) {
                return res.status(404).json({err: 'Products not fond'});
            }
            return res.status(200).json(products);
        })
};

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if(err) {
            return res.status(404).json({err: 'Categories not fond'});
        }
        return res.status(200).json(categories);
    });
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 8;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "price") {
                // gte - greater than price [0-10]
                // lte - less then
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec()
        .then(products => {return res.status(200).json({size:products.length, products})})
        .catch(err => {return res.status(400).json({err: errorHandler(err)})});
};

exports.productPhoto = (req, res, next) => {
    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    const query = {};

    if(req.query.search) {
        query.name = {$regex: req.query.search, $options: 'i'};

        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }

        Product.find(query, (err, products) => {
            if(err) {
                return res.status(404).json({err: 'Products not fond'});
            }

            res.json(products);
        }).select('-photo')
    }
};

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    });

    Product.bulkWrite(bulkOps, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                err: 'Cloud not update product'
            })
        }
        next();
    });
};