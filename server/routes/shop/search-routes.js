const express= require('express')

const {searchProducts}=require('../../controllers/shop/search-controller.js')

const router=express.Router()

router.get('/:keyword',searchProducts)  //bcz we're getting keyword as param

module.exports=router