import ProductImageUpload from "@/components/admin-view/image-upload"
import { Button } from "@/components/ui/button"
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice"
import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

function AdminDashboard(){
    const [imageFile,setImageFile]=useState(null)
    const [uploadedImageUrl,setUploadedImageUrl]=useState("")
    const [imageLoadingState,setImageLoadingState]=useState(false)
    const dispatch=useDispatch()
    const {featureImageList}=useSelector(state => state.commonFeature)

    function handleUploadFeatureImage(){
        if (!uploadedImageUrl) {
            toast.error("Please upload an image first")
            return
        }
        dispatch(addFeatureImage(uploadedImageUrl)).then(data=>{
            if(data?.payload?.success){
                dispatch(getFeatureImages())
                setImageFile(null)
                setUploadedImageUrl("")
            }
        }) 
    }

    function handleDeleteFeatureImage(getId){
        dispatch(deleteFeatureImage(getId)).then(data=>{
            if(data?.payload?.success){
                console.log(data,"data")
                dispatch(getFeatureImages())
                toast.success("Image deleted successfully!")
            }
            
        })
    }

    useEffect(()=>{
        dispatch(getFeatureImages())
    },[dispatch])

    console.log(featureImageList)

    return(
        <div>
            <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
                // isEditMode={currentEditedId !==null}     
            />
            <Button onClick={handleUploadFeatureImage} className="text-white bg-black mt-5 w-full">Upload</Button>
            <div className="flex flex-col gap-4 mt-5">
                {
                    featureImageList && featureImageList.length >0 ?
                    featureImageList.filter(item => item.image)
                        .map(featureImageItem => <div>
                        <img src={featureImageItem.image} alt={featureImageItem.title} className="w-full h-[300px] object-cover rounded-t-lg"/>
                        <Button className="bg-black text-white" onClick={()=>{handleDeleteFeatureImage(featureImageItem?._id)}}>Delete</Button>
                    </div>) :null
                }
            </div>
        </div>
    )
}

export default AdminDashboard