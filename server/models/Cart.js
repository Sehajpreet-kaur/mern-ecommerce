const mongoose=require('mongoose')

const CartSchema=new mongoose.Schema({
    userId:{
        // to identify whuch user is adding to Cart
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', //bcz picking it from user ref
        required:true
    },
    items:[{
        //instead of passing complete product we're going to mapm it using product ID

        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product', //bcz from product we're going to pick it
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1 // mean property , you will give min of 1
        }
    }]
},
{
    timestamps:true
})

module.exports= mongoose.model("Cart", CartSchema)