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

        const { name, description, price, category, shipping, quantity, photo } = fields;

        if(!name || !description || !price || !category || !shipping || !quantity) {
            return res.status(400).json({err: "Missing required fields."});
        }

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
    let limit = req.query.limit ? req.query.limit : 8;

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

