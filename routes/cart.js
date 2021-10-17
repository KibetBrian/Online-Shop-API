const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./tokenVerification');

//Get all cart products
router.get('/', verifyTokenAndAdmin, async (req, res)=>
{
    try
    {
        const allProducts = await Cart.find();
        res.status(200).json(allProducts)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});

//Add product to a cart 
router.put('/add', verifyTokenAndAuthorization, async(req, res)=>
{
    try
    {
        const newCart = new Cart(req.body);
        const savedProduct = await newCart.save();
        res.status(200).json(savedProduct)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});

//Update Cart
router.put ('/update/:id', verifyTokenAndAuthorization, async(req, res)=>
{
    try
    {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedCart)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});
//Delete Cart
router.delete('/delete/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try
    {
        const deleteCart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart Deleted')
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});

//Get Cart 
router.get('/ucart/', verifyTokenAndAuthorization, async (req, res)=>
{
    try
    {
        const getCart = await Cart.findOne({userId: req.user.id});
        res.status(500).json(getCart)
    }catch(err)
    {
        res.status(500).json(err);  
    }
});

module.exports = router;