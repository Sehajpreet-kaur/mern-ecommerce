const Order=require("../../models/Order")
const Product=require("../../models/Product")
const ProductReview=require("../../models/Review")  //to store review

const addProductReview=async(req,res)=>{
    try{
        const {productId,userId,username,reviewMessage,reviewValue}=req.body

        const order= await Order.findOne({
            userId,
            "cartItems.productId":productId,
            orderStatus:"confirmed"
        }) //find that one with userId productId to know whether bought or not and orderstatus as confirmed to know if payment is done

        if(!order){
            return res.status(403).json({
                success:false, message:"You need to purchase product to review it."
            })
        }

        //if already given review then can't add again , so chk existing review
        const checkExistingReview=await ProductReview.findOne({
            productId,userId
        })

        if(checkExistingReview){
            return res.status(400).json({
                success:false, message:"You already reviewed this product!"
            })
        }

        //else create new review
        const newReview=new ProductReview({
            productId,userId,username,reviewMessage,reviewValue
        })
        await newReview.save()

        //calculate average review using reduce(),  so find other reviews 
        const reviews= await ProductReview.find({productId})
        const totalReviewsLength=reviews.length
        const averageReview= reviews.reduce((sum,reviewItem)=> sum+reviewItem.reviewValue, 0)/totalReviewsLength

        //update product schema
        await Product.findByIdAndUpdate(productId,{averageReview})

        res.status(201).json({
            success:true, data:newReview
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false, message:"Error"
        })
    }
}

const getProductReviews=async(req,res)=>{
    try{
        const {productId}=req.params

        const reviews=await ProductReview.find({productId})
        res.status(200).json({
            success:true, data:reviews
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false, message:"Error"
        })
    }
}

module.exports={addProductReview,getProductReviews}