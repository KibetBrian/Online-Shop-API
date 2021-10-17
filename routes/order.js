const router = require('express').Router();
const Order = require('../models/Order');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./tokenVerification');

//Get all Order products
router.get('/', verifyTokenAndAdmin, async (req, res)=>
{
    try
    {
        const allOders = await Order.find();
        res.status(200).json(allOders)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});

//Create an Order
router.put('/', verifyTokenAndAdmin, async(req, res)=>
{
    try
    {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});

//Update Order
router.put ('/update/:id', verifyTokenAndAdmin, async(req, res)=>
{
    try
    {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedOrder)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});
//Delete Order
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res)=>{
    try
    {
        const deleteOrder = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order Deleted')
    }
    catch(err)
    {
        res.status(500).json(err)
    }
});

//Get Order 
router.get('/uOrder/', verifyTokenAndAuthorization, async (req, res)=>
{
    try
    {
        const getOrder = await Order.find({userId: req.user.id});
        res.status(500).json(getOrder)
    }catch(err)
    {
        res.status(500).json(err);  
    }
});

//Stats

//Get monthly income
router.get('/income', verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try 
    {
        const income = await Order.aggregate(
            [
                {$match: {}},
                {$project: {month: {$month: "$createdAt"}, sales: "$amount"}},
                {$group: {_id: "$month", total: {$sum: "$sales"}}}
            ]
            );
            res.status(200).json(income)
    }
    catch(err)
    {
        res.status(500).json(err.toString())
    }
})


module.exports = router;