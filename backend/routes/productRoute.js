const express = require('express')
const { addProduct, removeProduct, singleProduct, listProducts } = require('../controllers/productController');
const upload = require('../middleware/multer');
const adminAuth = require('../middleware/adminAuth');

const productRoute = express.Router()

productRoute.post("/add",adminAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 },{name: "image4", maxCount: 1 }]),addProduct);
productRoute.post("/remove",adminAuth, removeProduct);
productRoute.post("/single", singleProduct);
productRoute.get("/list", listProducts);

module.exports = productRoute