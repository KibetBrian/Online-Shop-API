const express = require ('express');
const app = express();
const mongoose = require ('mongoose');
const userRoute = require('./routes/user');
const authRoute = require ('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const paypalRoute = require('./routes/paypal');
require('dotenv').config()
app.use(express.json());

//Mongo DB Connection
mongoose.connect
(
    process.env.MONGODB_CONNECT
).then(()=>
{
    console.log('Database Connected');
}
).catch((err)=>
{
    console.log(err)
})

//Routes 
app.use('/api/user/', userRoute);
app.use('/api/auth/', authRoute);
app.use('/api/products/', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders/', orderRoute);
app.use('/api/payment/', paypalRoute);


//Port listening
app.listen(8080, ()=>
{
    console.log('Server Connected')
})
