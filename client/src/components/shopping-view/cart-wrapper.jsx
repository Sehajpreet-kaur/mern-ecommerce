import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCartItemsContent from './cart-items-content'
import { useNavigate } from 'react-router-dom'

function UserCartWrapper({cartItems,setOpenCartSheet}) {

    const navigate=useNavigate()

    // to update total in Cart
    const totalCartAmount=cartItems && cartItems.length>0 ?
    cartItems.reduce((sum,currentItem)=> sum+ (currentItem?.salePrice> 0 ? currentItem?.salePrice:currentItem?.price)* currentItem?.quantity,0)  //0 here is initial amount
    :0

    return (
    <SheetContent className="bg-white sm:max-w-md overflow-auto">
        <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className='mt-8 space-y-4'>
            {/* render cart items */}
            {
                cartItems && cartItems.length>0 ? cartItems.map((item)=> <UserCartItemsContent cartItem={item}/>):null
            }
        </div>
        <div className='mt-8 space-y-4'>
            <div className='flex justify-between'>
                <span className='font-bold'>Total</span>
                <span className='font-bold'>${totalCartAmount}</span>
            </div>
        </div>
        <Button onClick={()=>{
            navigate('/shop/checkout') ,setOpenCartSheet(false)
        }} className="w-full mt-6 bg-black text-white
        ">CheckOut</Button>
    </SheetContent>
  )
}

export default UserCartWrapper
