
require('dotenv').config()  //it will automatically read all env variables created,

const express=require('express')
const mongoose=require('mongoose')
// const cookieParser=require('cookie-parser')
const cors=require('cors')

const authRouter=require("./routes/auth/auth-routes.js")

const admminProductsRouter=require('./routes/admin/products-routes.js')
const adminOrderRouter =require("./routes/admin/order-routes.js")

const shopProductRouter=require("./routes/shop/products-routes.js")
const shopCartRouter=require('./routes/shop/cart-routes.js')
const shopAddressRouter=require("./routes/shop/address-routes.js")
const shopOrderRouter =require("./routes/shop/order-routes.js")
const shopSearchRouter=require("./routes/shop/search-routes.js")
const shopReviewRouter=require("./routes/shop/review-routes.js")

const commonFeatureRouter=require("./routes/common/feature-routes.js")

//create a database connection --->>> you can also use a separate file for this and then import/use that file here

mongoose.connect(process.env.MONGO_URL).then(()=> console.log("MongoDB connected")).catch((error)=> console.log(error))



const app=express()
const PORT=process.env.PORT || 5000;

app.use(
    cors({
        //client-side url-origin
        origin: process.env.CLIENT_BASE_URL,
        methods:['GET','POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials:false
    })
)

// app.use(cookieParser())
app.use(express.json())
app.use('/api/auth',authRouter)  // when we hit api/auth/register -- run registerUser

app.use('/api/admin/products',admminProductsRouter)
app.use("/api/admin/orders",adminOrderRouter)

app.use('/api/shop/products',shopProductRouter)
app.use("/api/shop/cart",shopCartRouter)
app.use("/api/shop/address",shopAddressRouter)
app.use("/api/shop/order",shopOrderRouter)
app.use("/api/shop/search",shopSearchRouter)
app.use("/api/shop/review",shopReviewRouter)

app.use("/api/common/feature",commonFeatureRouter)

app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))