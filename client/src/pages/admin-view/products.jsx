import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet,SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/configure";
import ProductImageUpload from "../../components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import {toast} from "sonner"
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData={
    image:null,
    title:'',
    description:'',
    category:'',
    brand:'',
    price:"",
    salePrice:'',
    totalStock:''
}

function AdminProducts(){

    const [openCreateProductsDialog,setOpenCreateProductsDialog]=useState(false)
    const [formData,setFormData]=useState(initialFormData)
    const [imageFile,setImageFile]=useState(null)
    const [uploadedImageUrl,setUploadedImageUrl]=useState("")
    const [imageLoadingState,setImageLoadingState]=useState(false)
    const [currentEditedId,setCurrentEditedId]=useState(null)

    const {productList}=useSelector((state)=>state.adminProducts)  // adminProducts is the state we made in store and productList is what we created in AsyncThunk
    const dispatch=useDispatch()

    function onSubmit(event){
        event.preventDefault()

        //currentEditedId is the product id which we are editing
        currentEditedId !==null ?dispatch(editProduct({
            id:currentEditedId,formData  //id of product which we are editing nd formData is what we are getting fromn state
        })).then((data)=>{
            console.log(data,"Edit")
        
            //if the data get updated then chk success nd fetch all products, setFormdata to initial values, close dialog nd set currentEditedId- null 
            if(data?.payload?.success){
                dispatch(fetchAllProducts())
                setFormData(initialFormData)
                setOpenCreateProductsDialog(false)
                setCurrentEditedId(null)
            }
        }):
        //first call async Thunk or product is saved, we need to fetch the list of products, create dispatch for fetchAllProducts
        dispatch(addNewProduct({
            ...formData,
            image:uploadedImageUrl
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllProducts())  //if success, fetch all products
                setOpenCreateProductsDialog(false) //close model
                setImageFile(null) //clear image
                setFormData(initialFormData)  //reset form
                toast.success("Product Added Successfully!")   // show toast
            }
        })
    }

    //to delete the product
    function handleDelete(getCurrentProductId){
        console.log(getCurrentProductId)
        dispatch(deleteProduct(getCurrentProductId)).then(data =>{
            if(data?.payload?.success){
                dispatch((fetchAllProducts()))
            }
        })
    }

    //to disable the button until all the fields are filled
    function isFormValid(){
        return Object.keys(formData).map((key)=> formData[key] !=="").every((item)=>item)  //every-- means every value has to be true then only this form wiil be valid
    }

    //when page load we need to get this
    useEffect(()=>{
        dispatch(fetchAllProducts())
    },[dispatch])

    console.log(productList,uploadedImageUrl,"productlist")

    return <Fragment>
        <div className="mb-5 w-full flex justify-end">
            <Button onClick={()=>setOpenCreateProductsDialog(true)} className="bg-black text-white">Add New Product</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {
                productList && productList.length >0 ? productList.map(productItem=> 
                <AdminProductTile setFormData={setFormData} setOpenCreateProductsDialog={setOpenCreateProductsDialog} setCurrentEditedId={setCurrentEditedId} product={productItem} handleDelete={handleDelete}/>):null
            }
        </div>
        <Sheet open={openCreateProductsDialog} onOpenChange={()=> {
            setOpenCreateProductsDialog(false)
            setCurrentEditedId(null)
            setFormData(initialFormData)
            }}>
            <SheetContent side="right" className="overflow-auto bg-white">
                <SheetHeader>
                    <SheetTitle>
                        {
                            currentEditedId !==null? "Edit Product": "Add New Product"
                        }
                    </SheetTitle>
                </SheetHeader>
                <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !==null}
                        
                        />

                <div className="py-6">
                    <CommonForm onSubmit={onSubmit} formData={formData} setFormData={setFormData }  buttonText={currentEditedId!==null ? "Edit":"Add" } formControls={addProductFormElements}
                    isBtnDisabled={ !isFormValid()}  //if formValid is false means some fields are not filled, so disable the button
                     />
                </div>
            </SheetContent>
        </Sheet>
    </Fragment>
}

export default AdminProducts