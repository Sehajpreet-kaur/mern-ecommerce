const Product =require("../../models/Product")

const searchProducts= async(req,res)=>{
    try{

        const {keyword}=req.params;
        //if it is not string , give error
        if(!keyword || typeof keyword !== "string"){
            return res.status(400).json({
                success:false, message:"Keyword is required and must be in string format"
            })
        }

        //else
        const regEx=new RegExp(keyword,'i')  //'i' for case insensitive

        //based on regEx create SearchQuery with filter and sort
        const createSearchQuery={
            // $or means it will either chk from the fields we will be mentioning below
            $or:[
                {title: regEx},
                {description: regEx},
                {category: regEx},
                {brand: regEx}
            ]
        }

        const searchResults=await Product.find(createSearchQuery)

        return res.status(200).json({
            success:true, data :searchResults
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false, message:"Error"
        })
    }
}

module.exports= {searchProducts}