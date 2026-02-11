const mongoose= require('mongoose')

//create Product Schema
const ProductSchema= new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number
},{timestamps:true});

module.exports= mongoose.model('Product',ProductSchema)   //name the model as -- Product and pass the Schema we created as -- ProductSchema

