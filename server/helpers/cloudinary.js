const cloudinary= require('cloudinary').v2;
//version v2
const multer=require('multer')

//now config above 2
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

//create storage instance or variable using multer
const storage=new multer.memoryStorage();

//create function using multer
async function ImageUploadUtil(files) {
    const result= await cloudinary.uploader.upload(files,{ resource_type:'auto'});

    return result;
}

const upload=multer({storage})  //pass the storage we have created 

module.exports= {upload,ImageUploadUtil}