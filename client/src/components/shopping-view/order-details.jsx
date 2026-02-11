import React, { useState } from 'react'
import { Label } from '../ui/label'
import { DialogContent, DialogTitle } from "../ui/dialog"
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'

function ShoppingOrderDetailsView({orderDetails}) {

    const {user} =useSelector(state => state.auth)

    console.log(orderDetails,"OrderDetails")

  return (
    <DialogContent className='sm:max-w-[600px] bg-white text-black'>
        <DialogTitle></DialogTitle>
        <div className='grid gap-6 '>
            <div className='flex mt-2 items-center justify-between'>
                <div className='font-medium'>Order ID</div>
                <Label>{orderDetails?._id}</Label>  
            </div>
             <div className='flex mt-2 items-center justify-between'>
                <div className='font-medium'>Order Date</div>
                <Label>{orderDetails?.orderDate.split('T')[0]}</Label>  
            </div>
            <div className='flex mt-2 items-center justify-between'>
                <div className='font-medium'>Order Price</div>
                <Label>${orderDetails?.totalAmount}</Label>  
            </div>
             <div className='flex mt-2 items-center justify-between'>
                <div className='font-medium'>Order Price</div>
                <Label>{orderDetails?.paymentMethod}</Label> 
            </div>
             <div className='flex mt-2 items-center justify-between'>
                <div className='font-medium'>Order Price</div>
                <Label>{orderDetails?.paymentStatus}</Label>  
            </div>
             <div className='flex mt-2 items-center justify-between'>
                <div className='font-medium'>Order Status</div>
                <Label>
                    <Badge className={`py-1 px-3 ${orderDetails?.orderStatus === 'confirmed' ? 'bg-green-500 text-white' :
                                        orderDetails?.orderStatus === "rejected"? "bg-red-600 text-white"
                                        :'bg-black text-white'}`}>{orderDetails?.orderStatus}</Badge>
                </Label>  
            </div>
            <Separator />
                <div className='grid gap-4 '>
                    <div className='grid gap-2'>
                        <div className='font-medium '>Order Details</div>
                        <ul className='grid gap-3'>
                            {
                                //render cartItems
                                orderDetails?.cartItems && orderDetails?.cartItems.length>0 ?
                                orderDetails?.cartItems.map(item =>(
                                <li className='flex items-center justify-between'>
                                    {/* render products here and after it render shipping or address info */}
                                    <span>Title: {item.title}</span>
                                    <span>Quantity: {item.quantity}</span>
                                    <span>Price: ${item.price}</span>
                                </li>
                                )) :null
                            }
                        </ul>
                    </div>
                </div>
                <div className='grid gap-4 '>
                    <div className='grid gap-2'>
                        <div className='font-medium '>Shipping Info</div>
                        {/* render address info here */}
                        <div className='grid gap-0.5 text-muted-foreground'>
                                <span>{user.username}</span>
                                <span>{orderDetails?.addressInfo?.address}</span>
                                <span>{orderDetails?.addressInfo?.city}</span>
                                <span>{orderDetails?.addressInfo?.pincode}</span>
                                <span>{orderDetails?.addressInfo?.phone}</span>
                                <span>{orderDetails?.addressInfo?.notes}</span>
                        </div>
                    </div>
                </div>
        </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetailsView
