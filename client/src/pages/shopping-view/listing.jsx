import ProductFilter from "@/components/shopping-view/filter"
import ProductDetailsDialog from "@/components/shopping-view/product-details"
import ShoppingProductTile from "@/components/shopping-view/product-tile"
import { Button } from "@/components/ui/button"
import { DropdownMenu,DropdownMenuContent,DropdownMenuRadioGroup,DropdownMenuRadioItem,DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { sortOptions } from "@/configure"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice"
import { ArrowUpDownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"

function createSearchParamsHelper(filterParams){
    const queryParams=[]

    for(const [key,value] of Object.entries(filterParams)){
        if(Array.isArray(value) && value.length >0) // is given array is array of value=(men,women,etc) 
        {
            const paramValue=value.join(',') //this function separates array elements by ,

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)  //push with key and paramValue -- encodeUri function appends this value at the end of the array
        }
    }
    return queryParams.join('&')  //to separate both sections{category,brand} use &
}

function ShoppingListing(){
    const dispatch=useDispatch()
    const {productList,productDetails}=useSelector(state=> state.shopProducts)  //name we have given in store // fetch productList from shop side
    const {user}=useSelector(state=> state.auth)
    const {cartItems}=useSelector(state => state.shopCart)
    const [filters,setFilters]=useState({})
    const [sort,setSort]=useState(null)
    const [searchParams,setSearchParams]=useSearchParams()
    const [openDetailsDialog,setOpenDetailsDialog]=useState(false)

    const categorySearchParam=searchParams.get('category')

function handleSort(value){
    setSort(value)
}

function handleFilter(getSectionId,getCurrentOption){
    console.log(getSectionId,getCurrentOption)

    let cpyFilters={...filters};
    const indexOfCurrentSection=Object.keys(cpyFilters).indexOf(getSectionId)

    if(indexOfCurrentSection === -1) // means no filter is selected
    {
        cpyFilters ={
            ...cpyFilters,
            [getSectionId]:[getCurrentOption]
        }
    }
    else //get the selected index
        {
            const indexOfCurrentSection =cpyFilters[getSectionId].indexOf(getCurrentOption)
            if(indexOfCurrentSection === -1) cpyFilters[getSectionId].push(getCurrentOption) //if the option is not already selected then push it inside otherwise remove(splice) it
                else cpyFilters[getSectionId].splice(indexOfCurrentSection,1)
    }
    setFilters(cpyFilters)
    sessionStorage.setItem('filters',JSON.stringify(cpyFilters)) ///whenever we refresh the page, we need to get those categories and brand selected in filters ,which were selected already , so stored those values in the storage and will extract from storage whenever we refresh the page
}

    function handleGetProductDetails(getCurrentProductId){
        console.log(getCurrentProductId)
        dispatch(fetchProductDetails(getCurrentProductId))
    }

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

    //to extract stored values from storage when refeshing the page
    useEffect(()=>{
        //on page load we're going to set some default value for sort--set price-lowtohigh default in page load
        setSort('price-lowtohigh')
        //similarly set filters by extracting from storage or as null // checkbox expect object/array so store below as an object 
        // const storedFilters = sessionStorage.getItem('filters')
        // setFilters(storedFilters ? JSON.parse(storedFilters) : {})
        setFilters(JSON.parse(sessionStorage.getItem("filters"))|| {})
    }, [categorySearchParam])

    useEffect(()=>{
        if(filters && Object.keys(filters).length >0)//if filters are selected update search params
        {
            //create query  //create helper function
            const createQueryString= createSearchParamsHelper(filters)
            //once query created, update search params with hook, update url
            setSearchParams(new URLSearchParams(createQueryString)) 
        }
    },[filters])

    // fetch list of products
    useEffect(()=>{
        if(filters!==null && sort!==null)
        dispatch(fetchAllFilteredProducts({filterParams:filters, sortParams:sort})) //pass filter and sort params
    },[dispatch,sort,filters])

    useEffect(()=>{
        if(productDetails!==null)
            setOpenDetailsDialog(true)
    },[productDetails])

    console.log(productList,"productList")

    return <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <ProductFilter filters={filters} handleFilter={handleFilter}/>
        <div className="bg-background w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between ">
                <h2 className="text-lg font-extrabold">All Products</h2>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground ">{productList?.length} Products</span>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size='sm' className="flex items-center gap-1">
                            <ArrowUpDownIcon className="w-4 h-4"/>
                            <span>Sort by</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuRadioGroup value={sort} onValueChange={handleSort} className="bg-white text-black">
                            {/* render sort options here from configure */}
                            {
                                sortOptions.map(sortItem=>
                                     <DropdownMenuRadioItem
                                      value={sortItem.id} key={sortItem.id}>{sortItem.label}
                                      </DropdownMenuRadioItem>)
                            }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
                
            </div>
            {/* fetch list of products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {
                    productList && productList.length >0 ?
                     productList.map((productItem) => (<ShoppingProductTile handleGetProductDetails={handleGetProductDetails} product={productItem} key={productItem.id} handleAddtoCart={handleAddtoCart}/>) ):null
                }
            </div>
        </div>
        {/* to open details dialog */}
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
}

export default ShoppingListing