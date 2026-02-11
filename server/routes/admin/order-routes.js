const express=require("express")

const { getAllOrderOfAllUser,getOrderDetailsForAdmin, updateOrderStatus } = require("../../controllers/admin/order-controller.js")
const router=express.Router()

router.get("/get",getAllOrderOfAllUser)
router.get("/details/:id",getOrderDetailsForAdmin)
router.put("/update/:id",updateOrderStatus)

module.exports =router