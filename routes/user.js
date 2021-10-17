const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./tokenVerification');

//User Update
router.put('/update/:id', verifyTokenAndAuthorization, async (req, res)=>
{
   if (req.body.password)
   {
    //bcrypt
    const saltRounds = 10;
    const plainTextPassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(plainTextPassword, salt);
   }
   try
   {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});

    const {password, ...others} = updatedUser._doc;
    res.status(200).json(others)
   }
   catch(err)
   {
       res.status(500).json(err);
   }
})

//Delete Account
router.delete('/delete', verifyTokenAndAuthorization, async (req, res)=>
{
    try 
    {
        const deleteUser = await User.findByIdAndDelete(req.user.id);
        res.status(200).send('User Deleted Successfully')
    }catch(err)
    {
        res.status(500).json(err)
    }
})
//Get User 
router.get('/getuser/:id', verifyTokenAndAdmin, async (req, res)=>
{
    try 
    {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    }catch(err)
    {
        res.status(500).json(err)
    }
})
//getAllUsers 

router.get('/allUsers', verifyTokenAndAdmin, async (req, res)=>
{
    try 
    {
        const users = await User.find();
        res.status(200).json(users)
    }
    catch(err)
    {
        res.status(500).json(err) 
    }
})
//User stats
router.get('/stats', verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear) - 1);
    try 
    {
        const data = await User.aggregate([
            {$match: { createdAt: {$gte: lastYear}}},
            {$project: {month: {$month: "$createdAt"}}},
            {$group: {_id: "$month", total: {$sum: 1}}}
        ])
        res.status(200).json(data)
    }catch(err)
    {
        res.status(500).json(err)
    }
})
module.exports = router;