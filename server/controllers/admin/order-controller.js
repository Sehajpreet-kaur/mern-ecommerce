const Order=require ('../../models/Order.js')

const getAllOrderOfAllUser=async(req,res)=>{
        try{

            const {userId}=req.params

            //find orders
            const orders=await Order.find({})

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

    const getOrderDetailsForAdmin=async(req,res)=>{
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
    
const updateOrderStatus=async(req,res)=>{
    try{
        const {id}=req.params
        const {orderStatus}=req.body  //bcz we need to update it

        const order=await Order.findById(id)
    
        if(!order){
            return res.status(404).json({
                success:false,message:"Order not found"
            })
        }

        await Order.findByIdAndUpdate(id,{orderStatus})

        res.status(200).json({
            success:true, message:"Order status updated successfully!"
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
        success:false, message:"Error occured"
        })
    }
}

module.exports={getAllOrderOfAllUser,getOrderDetailsForAdmin,updateOrderStatus}