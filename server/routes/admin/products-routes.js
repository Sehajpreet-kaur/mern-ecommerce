const express= require('express')

const {handleImageUpload}=require('../../controllers/admin/products-controller.js')
const {addProduct,fetchAllProducts,editProduct,deleteProduct}=require("../../controllers/admin/products-controller.js")

const {upload}=require('../../helpers/cloudinary.js')

const router=express.Router()

router.post("/upload-image",upload.single("my_file"),handleImageUpload) // upload.single-- single file upload and namefile as my_file and tell which controller will handle it -- handleImageUpload
router.post('/add',addProduct)
router.put('/edit/:id',editProduct)
router.delete('/delete/:id',deleteProduct)
router.get('/get',fetchAllProducts)

module.exports=router