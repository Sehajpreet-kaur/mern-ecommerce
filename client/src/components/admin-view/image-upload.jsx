import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" 
import { useEffect, useRef } from "react"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios  from "axios"
import { Skeleton } from "@/components/ui/skeleton"

function ProductImageUpload({imageFile,setImageFile,uploadedImageUrl,setUploadedImageUrl,setImageLoadingState,imageLoadingState,isEditMode, isCustomStyling=false})
{

    const inputRef=useRef(null)

    function handleImageFileChange(event){
        console.log(event.target.files,"event.target.files")// gives the info about image

        const selectedFile=event.target.files?.[0]  //here we will get the first element
        if(selectedFile) setImageFile(selectedFile)  //if selectedFile will be true then setImageFile will be selectedFile

    }

    function handleDragOver(event){
        event.preventDefault()
    }
    function handleDrop(event){
        event.preventDefault()
        const droppedFile=event.dataTransfer.files?.[0];
        if(droppedFile) setImageFile(droppedFile)  // if dropped file will be true then setImageFile will be droppedFile
    }

    function handleRemoveImage(){
        setImageFile(null)
        if(inputRef.current){
            inputRef.current.value="";
        }
    }
    

    async function uploadImageToCloudinary(){
        setImageLoadingState(true)
        const data=new FormData();
        data.append('my_file',imageFile) // pass the my_file -uploaded and imageFile we have created
        const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,data)  //call our url
        //this will give u the response back ,then chk the response
        console.log(response,"response")

        if(response?.data?.success) {
            setUploadedImageUrl(response.data.result.url)
            setImageLoadingState(false)
            } //if response is true , get the url from it


    }    
    useEffect(()=>{
        //if image is not null , upload to cloudinary
        if(imageFile !==null) uploadImageToCloudinary()

    },[imageFile])

    return(
        <div className={`w-full mt-4 ${isCustomStyling ? '': 'max-w-md mx-auto' }`}>
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode ?"opacity-50":""} border-2 border-dashed rounded-lg p-4`}>
                <Input 
                id="image-upload" type="file" 
                className="hidden" 
                ref={inputRef} onChange={handleImageFileChange}
                disabled={isEditMode}
                 />
                {
                    //if image is not there , show drag n drop , if there show image info
                    !imageFile ?
                    (<Label htmlFor="image-upload" className={`${isEditMode ? 'cursor-not-allowed':""}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"/>
                        <span>Drag & drop or Click to upload image</span>
                    </Label>) : (//while loading image, show skeleton
                        imageLoadingState ?
                        <Skeleton className="h-10 bg-gray-100" />:
                        //if image is already rendered, render image related info
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileIcon className="w-8 h-8 text-primary mr-2" />
                        </div>
                        <p className="text-sm font-medium">{imageFile.name}</p>
                        {/* to remove the file */}
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage}>
                            <XIcon className="w-4 h-4" />
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>)
                }
            </div>
        </div>
    )
}

export default ProductImageUpload;