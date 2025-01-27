import React from "react";
import { FaImage } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import { getCroppedImg } from "@/Utils/cropImage";
import CropperComponent from "../CropperComponent";
import { Button } from "@/components/ui/button";
import { removeProductImage } from "@/api/Admin/productApi";

import { toast } from "sonner";

const ImageInputComponent = ({ImagesFields,handleImageChange,croppedImage,setCroppedImage,showCropper,setShowCropper,isProductImage,setImagesFields,id}) => {

  const handleCropDone = async (croppedAreaPixels,zoom,image,index) => {
    const croppedImg = await getCroppedImg(image, croppedAreaPixels, zoom);
    setCroppedImage((prev) => {
      const updated = [...prev]; // Make a shallow copy of the array
      updated[index] = croppedImg; // Replace the value at the specific index
      return updated; // Return the updated array
    });
    setShowCropper(null);
  };

  const handleCancel = () => {
    setShowCropper(null);
  };

  // upto 5 images can be uploaded for product and minimum three is needed
  const handleAddNewImageInput=()=>{
    setImagesFields((prev)=>([...prev,null]))
    setCroppedImage((prev)=>([...prev,null]))
  }

  // removing the field
  const handleRemoveImageInput=async(index)=>{
    
        setImagesFields((prev)=>{
        const currentImages = [...prev];
        currentImages.splice(index,1);
        return currentImages;  
        })
        setCroppedImage((prev)=>{
        const currentImages=[...prev];
        currentImages.splice(index,1)
        return currentImages
        })
        if(id && croppedImage[index]!==null && !croppedImage[index]?.size)
          {
            try{
              const response = await removeProductImage(id,index)
              toast.success(response.message)
              
            }catch(error)
            {
              toast.error(error.message)
            }
          }
  }

  return (
    <>
    <div className="grid gap-3 ">
      {ImagesFields.map((image, index) =>
        index === 0 ? (
          <div className="m-auto mb-5 col-span-4 flex flex-col gap-3 border-2 border-dashed border-gray-300 rounded-md p-8 pt-3  max-w-xs">
            
            {croppedImage[index] ? (
              <img src={croppedImage[index]?.size?URL.createObjectURL(croppedImage[index]):croppedImage[index]} alt="Cropped" className="w-full  object-cover rounded-md"/>
            ) : (
              <div className="text-gray-500 ">
                <div className="w-full flex justify-center">
                  <div className="border-2 border-gray-600 p-2 rounded-3xl bg-black">
                    <FaImage className="text-white" />
                  </div>
                </div>
                click here to add image
              </div>
            )}
            <label htmlFor="main-upload" className="cursor-pointer px-4 py-2 w-full text-center bg-black text-white rounded-md">{croppedImage[index]?"Change Image":"Add Image"}</label>
            <input id="main-upload" type="file" accept="image/*" className="hidden" onChange={(e)=>handleImageChange(index,e)}/>
            {croppedImage[index]?.size && <Button className="m-0 w-50" onClick={()=>setShowCropper(index)}>Re Crop</Button>}
            {showCropper===index && <CropperComponent image={image} onCropDone={handleCropDone} onCancel={handleCancel} index={index} isProductImage={isProductImage}/>}
          </div>
        ) : (
          <div className="col-span-2 lg:col-span-1">
            
            <div className="flex flex-col items-center  gap-3 border-2 border-dashed border-gray-300 rounded-md p-4">

            {index >2 &&
              <div onClick={()=>handleRemoveImageInput(index)} className="border-2  border-gray-600 p-1 rounded-3xl bg-black w-6 h-6 items-center ms-auto flex justify-center">
             <ImCross className="text-white  text-[10px]"/>
              </div>}
            
              {croppedImage[index] ? (
                <img src={croppedImage[index]?.size?URL.createObjectURL(croppedImage[index]):croppedImage[index]}  className="w-40 object-cover rounded-md"/>
              ) : (
                <div className="text-gray-500 text-sm text-center h-32 pt-5">
                  <div className="w-full flex justify-center mb-5">
                    <div className="border-2 border-gray-600 p-2 rounded-3xl bg-black">
                      <FaImage className="text-white " />
                    </div>
                  </div>
                  <span>click here to add image</span>
                </div>
              )}
              <label htmlFor={`upload-${index}`} className="cursor-pointer px-3 py-1 w-full text-center bg-black text-white rounded-md text-sm">{croppedImage[index]?"Change Image":"Add Image"}</label>
              <input id={`upload-${index}`} accept="image/*" type="file" className="hidden" onChange={(e) => handleImageChange(index, e)}/> 
              {croppedImage[index]?.size && <Button className="m-0 w-50" onClick={()=>setShowCropper(index)}>Re Crop</Button>}
            </div>
            {showCropper===index && <CropperComponent image={image} onCropDone={handleCropDone} onCancel={handleCancel} index={index} isProductImage={isProductImage}/>}
          </div>  
        )
      )}  
    </div>

    {isProductImage && ImagesFields.length<5 && <div className="text-gray-500 text-sm text-center p-20  border-2 border-dashed rounded">
                  <div className="w-full flex justify-center ">
                    <div className="border-2 border-gray-600 p-2 rounded-3xl bg-black">
                    <FaPlus className="text-white" onClick={handleAddNewImageInput}/>
                    </div>
                  </div>
                </div>}
    </>
  );
};

export default ImageInputComponent;

