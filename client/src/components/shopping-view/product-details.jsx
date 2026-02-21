//this will receive product details

import { StarIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {toast} from "sonner"
import { useDispatch, useSelector } from "react-redux"
import {addToCart,fetchCartItems} from "@/store/shop/cart-slice"
import { setProductDetails } from "@/store/shop/product-slice"
import { Label } from "../ui/label"
import StarRatingComponent from "../common/star-rating"
import { useEffect, useState } from "react"
import { addReview, getReviews } from "@/store/shop/review-slice"

function ProductDetailsDialog({open,setOpen,productDetails}) {

    const [reviewMsg,setReviewMsg]=useState("")
    const [rating,setRating]=useState(0)
    const dispatch=useDispatch()
    const {user}=useSelector(state=> state.auth)
    const {cartItems}=useSelector(state=> state.shopCart)
    const {reviews}=useSelector(state => state.shopReview)

    function handleRatingChange(getRating){
        setRating(getRating)  //getRating is star value we're passing starRating component
    }

    function handleDialogClose(){
        setOpen(false)
        dispatch(setProductDetails())  // to close details page
        setRating(0)
        setReviewMsg("")
    }

    function handleAddReview(){
        dispatch(addReview({
            productId: productDetails?._id,
            userId:user?.id,
            username: user?.username,
            reviewMessage: reviewMsg,
            reviewValue: rating
        })).then(data=>{
                if(data?.payload?.success){
                    setRating(0)
                    setReviewMsg("")
                    dispatch(getReviews(productDetails?._id))
                    toast.success("Review added successfully!")
                }else{
                    toast.error(data?.payload?.message || "Please purchase the product first!")
                    setRating(0)
                    setReviewMsg("")
                }
        })
    }

    function handleAddtoCart(getCurrentProductId,getTotalStock){
            console.log(getCurrentProductId)

            let getCartItems= cartItems.items || []

            if (getCartItems.length){
                const indexOfCurrentItem= getCartItems.findIndex(item=> item.productId === getCurrentProductId)
                if(indexOfCurrentItem >-1){
                    const getQuantity= getCartItems[indexOfCurrentItem].quantity 
                    if(getQuantity +1 >getTotalStock){
                        toast.error(`Only ${getQuantity} quantity can be added for this item`)
                        return;
                    }   
                }
            }

            dispatch(addToCart({userId:user?.id,productId:getCurrentProductId,quantity:1}))
                .then(data=>{
                    if(data?.payload){
                        dispatch(fetchCartItems(user?.id))
                        toast.success("Product is added to Cart")
                    }
                })
        }
    //for pageLoad
    useEffect(()=>{
        if(productDetails !==null) 
            dispatch(getReviews(productDetails?._id))  //if productdetails is there , then only dispatch reviews
    },[productDetails])

    const averageReview=reviews && reviews.length>0 ?
     reviews.reduce((sum,reviewItem)=> sum+reviewItem.reviewValue, 0)/reviews.length :0

    return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="bg-white grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
           <DialogTitle >
                <div className="relative overflow-hidden rounded-lg"> 
                {/* here will render image */}
                <img 
                    //img will be from productDetails
                    src={productDetails?.image}
                    alt={productDetails?.title}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover"
                />
            </div>
           </DialogTitle>
            <div className="">
                <div>
                    <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                    <p className="text-muted-foreground text-2xl mb-5 mt-4">{productDetails?.description}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice>0 ?"line-through":""}`}>${productDetails?.price}</p>
                    {
                        productDetails?.salePrice>0? <p className="text-2xl font-bold text-muted-foreground">${productDetails?.salePrice}</p> :null
                    }
                </div>
                <div className="flex items-center gap-0.5">
                    <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={averageReview} />
                    </div>  
                    <span className="text-muted-foreground">{averageReview.toFixed(2)}</span>            
                </div>
                <div className="mt-5 mb-5">
                    {
                        productDetails?.totalStock ===0 ?
                        <Button className="w-full bg-black text-white opacity-60 cursor-not-allowed">
                            Out of Stock</Button> :
                        <Button onClick={()=>handleAddtoCart(productDetails?._id,productDetails?.totalStock)} className="w-full bg-black text-white">
                            Add to Cart</Button>
                    }
                </div>
                <Separator />
                <div className="max-h-[300px] overflow-auto">
                    <h2 className="text-xl font-bold mb-4">Reviews</h2>
                    <div className="grid gap-6">
                        {
                            //show reviews here
                            reviews && reviews.length>0 ?
                            reviews.map(reviewItem=> 
                                <div className="flex gap-4">
                                <Avatar className="w-10 h-10 border">
                                    <AvatarFallback>{reviewItem?.username?.[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold">{reviewItem?.username}</h3>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <StarRatingComponent rating={reviewItem?.reviewValue} />
                                </div>
                                <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                            </div>
                        </div>
                            )
                            :<h1>No Reviews</h1>
                        }
                    </div>
                    <div className="mt-10 flex-col flex gap-2">
                        <Label>Write a review</Label>
                        <div className="flex gap-1">
                            <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange}/>
                        </div>
                        <Input name="reviewMsg" value={reviewMsg} onChange={(event)=> setReviewMsg(event.target.value)} placeholder="Write a review... " />
                        <Button onClick={handleAddReview} disabled={reviewMsg.trim() ===""} className="bg-black text-white">Submit</Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ProductDetailsDialog
