const Cart=require('../../models/Cart.js')
const Product=require("../../models/Product.js")

const addToCart=async(req,res)=>{
    try{
        //for add to cart , we need to get userId, productId, quantity
        const {userId,productId, quantity}=req.body

        if(!userId || !productId || quantity<=0){
            return res.status(400).json({
                success:false,message:"Invalid data provided"
            })
        }

        //the product should be available which we going to add based on productid 
        const product=await Product.findById(productId)
        //if not found
        if(!product){
            return res.status(404).json({
                success:false,message:"Product not found"
            })
        }

        let cart=await Cart.findOne({userId})
        //if product is not already in cart then add it with empty array
        if(!cart){
            cart=new Cart({userId,items:[]})
        }

        const findCurrentProductIndex=cart.items.findIndex(item => item.productId.toString() === productId)
        if(findCurrentProductIndex === -1){
            cart.items.push({productId,quantity})
            //added product first time so eqal to -1
        }else{
            //otherwise the product already added so increase the quantity
            cart.items[findCurrentProductIndex].quantity +=quantity
        }

        console.log(cart.items,"CartItems")

        await cart.save()
        res.status(200).json({
            success:true, data:cart
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,message:"Error"
        })
    }
}

const fetchCartItems=async(req,res)=>{
    try{
        const {userId}=req.params

        if(!userId){
            return res.status(400).json({
                success:false, message:"User Id is mandatory!"
            })
        }

        const cart=await Cart.findOne({userId}).populate({
            path:'items.productId',  //bcz we have given ref in model so use path for that ref and we need productId 
            select:"image title price salePrice" //select which properties we want from ref model
        })

        //if cart is not present
        // if(!cart){
        //     return res.status(400).json({
        //         success:false, message:"Cart not found"
        //     })
        // }

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                _id: null,
                userId,
                items: []
                }
            })
            }

        //to validate items which are added to cart and shouldn't del by admin
        const validItems=cart.items.filter(productItem=> productItem.productId)  //if productItem.productId is present then only it is valid item
        if(validItems.length < cart.items.length)  //means some of the items are del
        {       
            cart.items=validItems
            await cart.save()
        }

        const populateCartItems=validItems.map((item)=>({
            productId:item.productId._id,
            image:item.productId.image,
            title:item.productId.title,
            price:item.productId.price,
            salePrice:item.productId.salePrice,
            quantity:item.quantity,
        }))

        res.status(200).json({
            success:true, data:{
                ...cart._doc,
                items:populateCartItems
            }
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,message:"Error"
        })
    }
}

const updateCartItemQty=async(req,res)=>{
    //update is simialr to addToCart
    try{
        //for add to cart , we need to get userId, productId, quantity
        const {userId,productId, quantity}=req.body

        if(!userId || !productId || quantity<=0){
            return res.status(400).json({
                success:false,message:"Invalid data provided"
            })
        }

    const cart=await Cart.findOne({userId})
    // if(!cart){
    //     return res.status(404).json({
    //         success:false, message:"Cart not found"
    //     })
    // }
    if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                _id: null,
                userId,
                items: []
                }
            })
            }

    const findCurrentProductIndex=cart.items.findIndex(item =>item.productId.toString() === productId)
    if(findCurrentProductIndex === -1)//not present
    {
        return res.status(404).json({
            success:false , message:"Cart item not present"
        })
    }
    cart.items[findCurrentProductIndex].quantity=quantity
    await cart.save()

    await cart.populate({
        path:'items.productId',
        select:"image title price salePrice"
    })

    const populateCartItems=cart.items.map(item=>({
            productId:item.productId? item.productId._id:null,
            image:item.productId?item.productId.image:null,
            title:item.productId?item.productId.title:"Product not found",
            price:item.productId? item.productId.price:null,
            salePrice:item.productId? item.productId.salePrice:null,
            quantity:item.quantity,
        }))

    res.status(200).json({
            success:true, data:{
                ...cart._doc,
                items:populateCartItems
            }
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,message:"Error"
        })
    }
}

const deleteCartItem=async(req,res)=>{
    try{
        //need userid and productId to del it
        const{userId,productId}=req.params
        if(!userId || !productId ){
            return res.status(400).json({
                success:false,message:"Invalid data provided"
            })
        }

        const cart=await Cart.findOne({userId}).populate({
            path:'items.productId', 
            select:"image title price salePrice"
        })

        // if(!cart){
        //     return res.status(400).json({
        //         success:false, message:"Cart not found"
        //     })
        // }
        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                _id: null,
                userId,
                items: []
                }
            })
            }

        //we want to del cart.items
        cart.items=cart.items.filter(item=>item.productId._id.toString() !==productId)

        await cart.save()

        await cart.populate({
        path:'items.productId',
        select:"image title price salePrice"
    })

    const populateCartItems=cart.items.map(item=>({
            productId:item.productId? item.productId._id:null,
            image:item.productId?item.productId.image:null,
            title:item.productId?item.productId.title:"Product not found",
            price:item.productId? item.productId.price:null,
            salePrice:item.productId? item.productId.salePrice:null,
            quantity:item.quantity,
        }))

    res.status(200).json({
            success:true, data:{
                ...cart._doc,
                items:populateCartItems
            }
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,message:"Error"
        })
    }
}

module.exports={addToCart,fetchCartItems,updateCartItemQty,deleteCartItem}