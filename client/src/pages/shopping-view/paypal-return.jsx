import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { capturePayment } from '@/store/shop/order-slice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

function PaypalReturnPage() {

  const dispatch=useDispatch()
  const location=useLocation()
  const params=new URLSearchParams(location.search)
  const paymentId=params.get("paymentId")  //to get paymentId from search params
  const payerId=params.get("PayerID")

  useEffect(()=>{

    //if paymentId and payerId are there, we need to get our current orderId from sessionStorage
    if(paymentId && payerId){
      const orderId=JSON.parse(sessionStorage.getItem("currentOrderId"))

      //pass 3 things to dispatch(capturePayment)
      dispatch(capturePayment({paymentId,payerId,orderId})).then((data)=>{
        if(data?.payload?.success){
          sessionStorage.removeItem('currentOrderId') //if success, remove orderId
          window.location.href="/shop/payment-success"  //go to payment-success page
        }
      })
    }

  },[paymentId,payerId,dispatch])

  return <Card>
    <CardHeader>
      <CardTitle>Processing Payment... Please wait!</CardTitle>
    </CardHeader>
  </Card>
}

export default PaypalReturnPage
