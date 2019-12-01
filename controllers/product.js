const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const errorHandler = require('../helpers/dbErrorHandler');

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