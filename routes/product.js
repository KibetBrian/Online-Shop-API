const router = require('express').Router();
const Product = require('../models/Product')
const { verifyTokenAndAdmin } = require('./tokenVerification')

//Add a product
router.post('/add', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json('New Product Added')
    }
    catch (err) {
        res.status(200).json(err)
    }
});

//Update Product
router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(500).json(err)
    }
});

//Delete product
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).send('Product Deleted Successfully')
    } catch (err) {
        res.status(500).json(err)
    }
});

//Get product
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
});

//Get all products
router.get('/allproducts', async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;

    try {
        let products;
        if (queryNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (queryCategory) {
            products = await Product.find({ category: { $in: [queryCategory] } })
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;