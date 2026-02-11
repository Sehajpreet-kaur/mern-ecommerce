import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { addressFormControls } from '@/configure'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddress } from '@/store/shop/address-slice/index.js'
import AddressCard from './address-card'
import { toast } from 'sonner'

const initialAddressFormData={
    address:"",
    city:"",
    phone:"",
    pincode:"",
    notes:""
}

function Address({setCurrentSelectedAddress,selectedId}) {

    const [formData,setFormData]=useState(initialAddressFormData)
    const [currentEditedId,setCurrentEditedId]=useState(null)
    const dispatch=useDispatch()
    const {user}=useSelector(state=> state.auth)
    const {addressList}=useSelector(state => state.shopAddress)

    function handleManageAddress(event){
        event.preventDefault()

        if(addressList.length>=3 && currentEditedId===null){
            setFormData(initialAddressFormData)
            toast.error("You cannot add max of 3 addresses!")
            return
        }

        currentEditedId!==null ? dispatch(editaAddress({
            userId: user?.id ,addressId:currentEditedId, formData
        })).then(data=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddress(user?.id))
                setCurrentEditedId(null)
                setFormData(initialAddressFormData)
                toast.success("Address updated successfully!")
            }
        }):
        dispatch(addNewAddress({
            ...formData,
            userId:user?.id
        })).then(data=>{
            console.log(data)
            if(data?.payload?.success){
                dispatch(fetchAllAddress(user?.id))  //fetchAllAddress require userId so take it from user?.id
                setFormData(initialAddressFormData)  //set to initial values as empty strings
                toast.success("Address added successfully!")
            }
        })
    }

    function isFormValid(){
        return Object.keys(formData).map((key)=> formData[key].trim() !=="").every((item)=>item) //if formData is != empty then every item should be true
    }

    function handleDeleteAddress(getCurrentAddress){
        console.log(getCurrentAddress)
        dispatch(deleteAddress({userId:user?.id, addressId:getCurrentAddress._id})).then(data=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddress(user?.id))
                toast.success("Address deleted successfully!")
            }
        })
    }

    function handleEditAddress(getCurrentAddress){
        setCurrentEditedId(getCurrentAddress?._id)  //set editId to current ID
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone:getCurrentAddress?.phone,
            pincode:getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes
        }) //fill form with existing values
    }

    useEffect(()=>{
        dispatch(fetchAllAddress(user?.id))
    },[dispatch])

    console.log(addressList,"addressList")

  return (
      <Card>
        <div className='mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2'>
           {
            //render addressList here
            addressList && addressList.length>0 ?addressList.map((singleAddressItem)=>
                <AddressCard selectedId={selectedId} handleDeleteAddress={handleDeleteAddress} handleEditAddress={handleEditAddress} addressInfo={singleAddressItem} setCurrentSelectedAddress={setCurrentSelectedAddress}/>) :null
           }
        </div>
        <CardHeader>
            <CardTitle>{currentEditedId!==null ?"Edit Address" :"Add new Address"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {/* render common form here */}
            <CommonForm formControls={addressFormControls} //formControls from configure 
            formData={formData} setFormData={setFormData} buttonText={currentEditedId!==null ?"Edit Address" :"Add new Address"} onSubmit={handleManageAddress} 
            isBtnDisabled={!isFormValid()}
            /> 
        </CardContent>
      </Card>)
}

export default Address
