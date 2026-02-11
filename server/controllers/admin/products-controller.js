const { ImageUploadUtil } = require("../../helpers/cloudinary")
const Product = require("../../models/Product")

const handleImageUpload=async(req,res)=>{
    try{
        //first convert req to base64
        const b64=Buffer.from(req.file.buffer).toString('base64')
        //after this we will get a url
        const url="data:" +req.file.mimetype +";base64," +b64
        const result=await ImageUploadUtil(url)

        res.json({
            success:true,
            result
        })

    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error Occured"})
    }
}

//Add a new Product
const addProduct=async(req,res)=>{
    try{
        //get the data
        const {image,title,description,category,brand, price,salePrice,totalStock}=req.body;
        //now create new Product
        const newlyCreatedProduct=new Product({
            image,title,description,category,brand, price,salePrice,totalStock
        })

        await newlyCreatedProduct.save();
        res.status(201).json({
            success:true,
            data:newlyCreatedProduct
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Error occured'
        })
    }
}

//Fetch all Products
const fetchAllProducts=async (req,res)=>{
    try{
        //get all the products
        const listOfProducts= await Product.find({});
        res.status(200).json({
            success:true,data:listOfProducts
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Error occured'
        })
    }
}

//Edit a product
const editProduct=async (req,res)=>{
    try{
        //edit by product id
        // if we have 10 products, when we click on particular product, we need to get that product Id in order to update that product

        const {id}=req.params;   //this will be product ID
        //first chk if the product exist or not, if not return error, if exist replace product info with updated info
        const {image,title,description,category,brand, price,salePrice,totalStock}=req.body; // get the data

        let findProduct=await Product.findById(id)
        if(!findProduct) return res.status(404).json({
            success:false,
            message:"Product not found"
        })

        //if found, update the product
        findProduct.title=title || findProduct.title //either updated title we get from body or existing title--findProduct.title
        findProduct.description=description || findProduct.description
        findProduct.category=category || findProduct.category
        findProduct.brand=brand || findProduct.brand
        findProduct.price=price===""?0:price || findProduct.price
        findProduct.salePrice=salePrice ===""?0:salePrice || findProduct.salePrice
        findProduct.totalStock=totalStock || findProduct.totalStock
        findProduct.image=image || findProduct.image

        await findProduct.save();
        res.status(200).json({
            success:true,
            data:findProduct
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Error occured'
        })
    }
}

//Delete a product
const deleteProduct=async (req,res)=>{
    try{
        //get id of the product to understand which product is needed to be deleted
        const{id}=req.params

        const product=await Product.findByIdAndDelete(id)

        if(!product) return res.status(404).json({
            success:false, message:"Product not found"
        })
        res.status(200).json({
            success:true, message:"Product deleted successfully"
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Error occured'
        })
    }
}

module.exports={handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct}