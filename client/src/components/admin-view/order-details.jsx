import React, { useState } from 'react'
import { Label } from '../ui/label'
import { DialogContent, DialogTitle } from "../ui/dialog"
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from '../ui/badge'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from '@/store/admin/order-slice'
import { toast } from 'sonner'

const initialFormData={
    status:""
}

function AdminOrderDetailsView({orderDetails}) {

    const [formData,setFormData]=useState(initialFormData)
    const {user}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()

    function handleUpdateStatus(event){
        event.preventDefault()
        console.log(formData)
        const {status}= formData

        dispatch(updateOrderStatus({id:orderDetails?._id, orderStatus:status})).then(data =>{
            //if success , update order status in model
            if(data?.payload?.success){
                dispatch(getOrderDetailsForAdmin(orderDetails?._id))
                dispatch(getAllOrdersForAdmin())
                setFormData(initialFormData)
                toast.success(data?.payload?.message)
            }
        })
    }

  return (
    <DialogContent className='sm:max-w-[600px] bg-white text-black max-h-[90vh] overflow-y-auto'>
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

                <div>
                    <CommonForm formControls={
                        [{
                            label: "Order Status",
                            name: "status",
                            componentType: "select",
                            options: [
                            { id: "pending", label: "Pending" },
                            { id: "inProcess", label: "In Process" },
                            { id: "inShipping", label: "In Shipping" },
                            { id: "delivery", label: "Delivery" },
                            { id: "rejected", label: "Rejected" },
                            ],
                        }]
                    }
                    formData={formData} setFormData={setFormData} buttonText={"Update Order Status"} onSubmit={handleUpdateStatus}
                    />
                </div>

        </div>
    </DialogContent>
  )
}

export default AdminOrderDetailsView
