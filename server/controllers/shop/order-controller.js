const { paypal } = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product= require("../../models/Product")

//in this method, we're going to save order to db
const createOrder=async(req,res)=>{
    try{
        const {userId,cartItems,addressInfo,orderStatus,paymentMethod,paymentStatus,totalAmount,orderDate,orderUpdateDate,paymentId,payerId,cartId}=req.body

        if (!cartItems || !Array.isArray(cartItems)) {
            return res.status(400).json({
                success: false,
                message: "cartItems missing"
            });
            }


        //create payment json that will help to create paypal payment instance
        const create_payment_json={
            intent:"sale",
            payer:{
                payment_method:"paypal"
                //tells payment method which is paypal
            },
            redirect_urls:{
                // will tell redirect urls
                return_url:`${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                cancel_url:`${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
            },
            transactions:[
                {
                    //itemsList that wht items that user is actually bought -- cartItems
                    item_list:{
                        items: cartItems.map(item=> ({
                            //return  //created in model-order.js
                            name:item.title,
                            sku: item.productId,
                            price:item.price.toFixed(2),
                            currency:"USD",
                            quantity:item.quantity
                        }))
                    },
                    amount:{
                        currency:"USD",
                        total:totalAmount.toFixed(2),
                    },
                    description: "description"
                }
            ]
        }

        //initiate paypal payment and pass createOrder method
        paypal.payment.create(create_payment_json,async(error,paymentInfo)=>{
            if(error){
                console.log(error)
                return res.status(500).json({
                    success:false, message:"Error while creating paypal payment"
                })
            }else{
                //means it was successful and create new order from Schema
                const newlyCreatedOrder= new Order({
                    userId,cartItems,addressInfo,orderStatus,paymentMethod,paymentStatus,totalAmount,orderDate,orderUpdateDate,paymentId,payerId,cartId
                })

                await newlyCreatedOrder.save()

                //will get approval link //will find link whether we'r having or not 
                const approvalURL=paymentInfo.links.find(link=> link.rel ==="approval_url").href 
                //if link== approvalUrl means payment was successful and it will give you href that we're going to get


                //thus paymentInfo will consist of approval-url which we re going to return
                res.status(200).json({
                    success:true, approvalURL, orderId: newlyCreatedOrder._id
                })
            }
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false, message:"Error occured"
        })
        
        }
}
//thus created order but to make it successfull we need capturePayment

//check whether the order was successful by paypal payment info
const capturePayment=async(req,res)=>{
    try{
        const {paymentId,payerId,orderId}=req.body

        //to find order
        let order=await Order.findById(orderId) // find order by orderID in db
        //if order not present
        if(!order){
            return res.status(404).json({
                success:false, message:"Order can not found"
            })
        }

        //if order is there, then after gertting it, update the order
        order.paymentStatus="paid"
        order.orderStatus="confirmed"
        order.paymentId=paymentId
        order.payerId=payerId //set the previous payerId to payerId we're getting from req.body

        for(let item of order.cartItems){
            //first will get the products
            let product= await Product.findById(item.productId)
            
            //if product not found- error
            if(!product){
                return res.status(404).json({
                    success:false, message:`Not enough Stock for this product ${product.title}`
                })
            }

            //or else update the stock
            product.totalStock -=item.quantity  // minus quantity req from total stock available 

            await product.save()
        }

        //also we need to get cartItem, so to drop it
        const getCartId=order.cartId
        await Cart.findByIdAndDelete(getCartId)//get cart Model and delete by cartId

        await order.save()

        res.status(200).json({
            success:true,
            message:"Order confirmed",
            data:order
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false, message:"Error occured"
        })
    }
}

    const getAllOrderByUser=async(req,res)=>{
        try{

            const {userId}=req.params

            //find orders
            const orders=await Order.find({userId})

            if(!orders.length){
                return res.status(404).json({
                    success:false,message:"No orders found!"
                })
            }

            //order found
            res.status(200).json({
                success:true, data:orders
            })

        }catch(e){
            console.log(e)
            res.status(500).json({
            success:false, message:"Error occured"
        }) 
        }
    }

    const getOrderDetails=async(req,res)=>{
        try{
            //we need id of that particular order to get details instead of userId
            const {id}=req.params

            const order=await Order.findById(id)

            if(!order){
                return res.status(404).json({
                    success:false,message:"Order not found"
                })
            }

            res.status(200).json({
                success:true, data:order
            })

        }catch(e){
            console.log(e)
            res.status(500).json({
            success:false, message:"Error occured"
        }) 
        }
    }

module.exports ={createOrder,capturePayment,getAllOrderByUser,getOrderDetails}

