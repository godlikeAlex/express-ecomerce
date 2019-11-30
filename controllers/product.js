const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const errorHandler = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) return req.status(400).json({err: "Image cloud not be uploaded"});

        const createdProduct = new Product(fields);
        if(files.photo) {
            createdProduct.photo.data = fs.readFileSync(files.photo.path);
            createdProduct.photo.contentType = files.photo.type;
        }
        createdProduct.save()
            .then(data => { return res.status(200).json(createdProduct) })
            .catch(err => { return res.json(400).json({err: errorHandler(err)}) })
    });
};