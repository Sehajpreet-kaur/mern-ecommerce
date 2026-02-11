
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { toast } from 'sonner'
import { fetchCartItems,addToCart } from '@/store/shop/cart-slice'
import { fetchProductDetails } from '@/store/shop/product-slice'
import ProductDetailsDialog from '@/components/shopping-view/product-details'

function SearchProducts() {

    const [keyword,setKeyword]=useState('')  // to handle Input
    const [searchParams,setSearchParams]=useSearchParams()
    const [openDetailsDialog,setOpenDetailsDialog]=useState(false)
    const dispatch=useDispatch()
    const {searchResults}=useSelector(state => state.shopSearch)
    const {cartItems}=useSelector(state => state.shopCart)
    const {user}=useSelector(state=> state.auth)
    const {productDetails}=useSelector(state =>state.shopProducts)

    useEffect(()=>{
        if(keyword && keyword.trim() !=="" && keyword.trim().length>=3)
        {
            //then dispatch fxn in controller
            setTimeout(()=>{
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword))
            },1000)
        }else{
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(resetSearchResults())
        }
    },[keyword])

    function handleAddtoCart(getCurrentProductId,getTotalStock){
        console.log(cartItems)
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
    function handleGetProductDetails(getCurrentProductId){
            console.log(getCurrentProductId)
            dispatch(fetchProductDetails(getCurrentProductId))
        }

    useEffect(()=>{
        if(productDetails!==null)
            setOpenDetailsDialog(true)
    },[productDetails])

  return (
    <div className='container mx-auto md:px-6 px-4 py-8'>
        <div className='flex justify-center mb-8'>
            <div className='w-full flex items-center'>
                <Input value={keyword} name="keyword" onChange={(event)=> setKeyword(event.target.value)} className="py-6 " placeholder="Search Products..." />
            </div>
        </div>
        {
            //chk condition here and render in other div
            !searchResults.length ? <h1 className='text-5xl font-extrabold'>No result found!</h1> :null
        }
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>{
            // render search results here
            searchResults.map(item => <ShoppingProductTile handleAddtoCart={handleAddtoCart} handleGetProductDetails={handleGetProductDetails} product={item}/>)
        }</div>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  )
}

export default SearchProducts
