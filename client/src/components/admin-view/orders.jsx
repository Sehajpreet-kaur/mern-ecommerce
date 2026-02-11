import React, { useEffect, useState } from 'react'
import { Card,CardHeader,CardTitle,CardContent } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import AdminOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'
import {resetOrderDetails} from "../../store/admin/order-slice/index.js"

function AdminOrdersView() {

  const [openDetailsDialog,setOpenDetailsDialog]=useState(false)
  const {orderList,orderDetails}=useSelector((state)=>state.adminOrder)
  const dispatch=useDispatch()

  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetailsForAdmin(getId))
  }

  useEffect(()=>{
    dispatch(getAllOrdersForAdmin())
  },[dispatch])

  useEffect(()=>{
    if(orderDetails !==null) setOpenDetailsDialog(true)
  },[orderDetails])

  return (
    <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Order Date</TableHead>
                                    <TableHead>Order Status</TableHead>
                                    <TableHead>Order Price</TableHead>
                                    <TableHead>
                                        <span className='sr-only'>Details</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                    {
                        //render order details
                        orderList && orderList.length >0 ? orderList.map(orderItem => 
                        <TableRow>
                            <TableCell>{orderItem?._id}</TableCell>
                            <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                            <TableCell>
                                <Badge className={`py-1 px-3 ${orderItem?.orderStatus === 'confirmed' ? 'bg-green-500 text-white' :
                                                    orderItem?.orderStatus === "rejected"? "bg-red-600 text-white"
                                                    :'bg-black text-white'}`}>{orderItem?.orderStatus}</Badge>
                            </TableCell>
                            <TableCell>{orderItem?.totalAmount}</TableCell>
                            <TableCell>
                                <Dialog open={openDetailsDialog} 
                                onOpenChange={()=>{
                                    setOpenDetailsDialog(false)
                                    dispatch(resetOrderDetails())
                                }}
                                >
                                        <Button onClick={()=> handleFetchOrderDetails(orderItem?._id)}
                                         className="bg-black text-white">View Details</Button>
                                    {orderDetails && (
                                        <AdminOrderDetailsView orderDetails={orderDetails}/>
                                    )}
                                </Dialog>

                            </TableCell>
                        </TableRow> ) :null 
                    }
                </TableBody>
                        </Table>
                    </CardContent>
        </Card>
  )
}

export default AdminOrdersView
