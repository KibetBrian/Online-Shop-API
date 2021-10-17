const router = require('express').Router();
const paypal = require('paypal-rest-sdk');
require('dotenv').config();


router.post('/pay', (req, res)=>
{
    const total = req.body.cart.total;
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": req.body.products
            },
            "amount": {
                "currency": "USD",
                "total": total
            },
            "description": "Product Description"
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            let links = payment.links;
            const approvalLink=links.find((link)=>(link.rel === 'approval_url'));
            res.status(200).json(approvalLink)
        }
    });
});

router.get('/cancel', (req, res)=>
{
    res.send('Canceled')
})

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_KEY,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
  });

router.post('/success', (req, res)=>
{
   const payerId = req.body.payerId;
   const paymentId = req.body.paymentId;

   console.log(req.body)

   const execute_payment_json = 
   {
       "payer_id": payerId,
       "transactions":
         [
             {
                "amount":
                {
                    "currency": "USD",
                    "total": "110"
,                }
             }
         ]
   }
   paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        if (payment)
        {
            // console.log(payment)
            // res.status(200).json(true)
            res.status(200).json(true)
        }
    }
});
});


module.exports = router;