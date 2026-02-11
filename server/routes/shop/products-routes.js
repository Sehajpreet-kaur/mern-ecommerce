const express= require('express')

const {getFilterProducts,getProductDetails}=require('../../controllers/shop/products-controller.js')

const router=express.Router()

router.get('/get',getFilterProducts)
router.get('/get/:id',getProductDetails)

module.exports=router