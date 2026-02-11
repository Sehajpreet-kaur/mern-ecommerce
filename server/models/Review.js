const mongoose=require('mongoose')

const ProductReviewSchema=new mongoose.Schema({
    productId: String,  //for what product user is giving review
    userId: String,
    username: String,
    reviewMessage: String,
    reviewValue: Number
},{timestamps:true})

module.exports=mongoose.model("ProductReview",ProductReviewSchema)