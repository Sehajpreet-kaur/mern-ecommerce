const Product=require('../../models/Product.js')

const getFilterProducts = async (req,res)=>{
    try{

        const {category=[], brand=[], sortBy="price-lowtohihgh"}= req.query  //get category and brand from query
        //for filters
        let filters={}
        
        if(category.length){
            filters.category={$in :category.split(',')}
        }
        if(brand.length){
            filters.brand={$in :brand.split(',')}
        }

        //for sort
        let sort={}

        switch(sortBy){
            case 'price-lowtohigh':
                sort.price=1
                break;
            case 'price-hightolow':
                sort.price=-1
                break;
            case 'title-atoz':
                sort.title=1
                break;
            case 'title-ztoa':
                sort.title=-1
                break;
            default:
                sort.price=1
                break
        }

        // get the products bcz we haven't applied filter functionality
        const products=await Product.find(filters).sort(sort) //get all products --find({})

        res.status(200).json({
            success:true,data:products
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,message:"Some Error occured"
        })
    }
}

const getProductDetails= async(req,res)=>{
    try{
        const {id}= req.params; // get id from params to get product details
        const product=await Product.findById(id)  //find product by id

        if(!product) return res.status(404).json({
            success:false, message:"Product not found"
        })

        //else return product 
        res.status(200).json({
            success:true, data:product
        })

    }catch(e){
       console.log(e)
        res.status(500).json({
            success:false,message:"Some Error occured"
        })  
    }
}

module.exports={getFilterProducts,getProductDetails}