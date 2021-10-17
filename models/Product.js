const mongoose = require ('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        productName: 
        {
            type: String,
            required: true,     
            unique: true       
        },
        productPrice:
        {
            type: Number,
            required: true
        },
        productDescription:
        {
            type: String
        },
        productImage: 
        {
            type: String,
            required: true
        },
        category: 
        {
            type: Array
        },
        productColor: 
        {
            type: Array
        },
        productInStock:
        {
            type: Boolean,
            default: true
        },
        productSize: 
        {
            type: Array
        }
        

    }, {timestamps: true}
)

module.exports = mongoose.model('product', ProductSchema)