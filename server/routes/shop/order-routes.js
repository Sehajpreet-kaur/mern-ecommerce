const express=require("express")

const {createOrder, capturePayment,getAllOrderByUser,getOrderDetails}=require("../../controllers/shop/order-controller.js")
const router=express.Router()

router.post("/create",createOrder)
router.post("/capture",capturePayment)
router.get("/list/:userId",getAllOrderByUser)
router.get("/details/:id",getOrderDetails)

module.exports =router