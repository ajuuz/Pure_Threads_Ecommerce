import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ImageInputComponent from "@/components/AdminComponent/Input/ImageInputComponent";
import InputComponent from "@/components/AdminComponent/Input/InputComponent";

import { Button } from "@/components/ui/button";
import SideBar from "@/components/AdminComponent/SideBar";
import { formDatasubmission } from "@/Utils/formDataSubmission";
import { getCategories } from "@/api/Admin/categoryApi";
import { editEntireProduct,  getParticularProduct } from "@/api/Admin/productApi";


// implementing toast for messages
import { toast } from "sonner"
import {toast as reactToastify} from 'react-toastify'
// for showing loading
import spinner from '../../../assets/Spin@1x-1.0s-200px-200px.svg'
import { validateOtherForms } from "@/Utils/formValidation";


const ManageProduct = () => {
  const [images, setImages] =  useState([null,null,null]);
  const [croppedImage,setCroppedImage]=useState([null,null,null]);
  const [showCropper,setShowCropper] = useState(null);
  const [categories,setCategories]=useState([]);
  const {id} = useParams();

  const navigate = useNavigate()

  const [formData,setFormData] = useState({
    name:"",
    description:"",
    regularPrice:0,
    isActive:true,
    category:"",
    sleeves:"",
    fit:"",
    S:0,
    M:0,
    L:0,
    XL:0,
    XXL:0,
    color:"",
    sizeOfModel:"",
    washCare:"",
    additionalInfo:["","",""]
  })

  const [loading ,setLoading] = useState(false)

  // useEffects
useEffect(()=>{
    if(id){
      try{
        const fetchParticluarProduct = async()=>
          {
          const particularProductResult = await getParticularProduct(id);
          setFormData(particularProductResult.product);
          console.log(particularProductResult.product)
          const imageURLs = particularProductResult.product.images.map(image=>image.url)
          setImages(imageURLs)
          setCroppedImage(imageURLs)
          }
           fetchParticluarProduct();
         }
    catch(error)
      {
      console.log(error.message);
      toast.error(error.message)
      }
  }
    const fetchCategory=async()=>{
    const categoriesResult=await getCategories();
    setCategories(categoriesResult.data);
    }
    fetchCategory();
  },[])


 const handleInputChange=(additionalInfo,e,value,name)=>{
  if(additionalInfo)
  {
    const index = parseInt(e.target.name)
     setFormData((prev) => {
      const updatedAdditionalInfo = [...prev.additionalInfo];
      updatedAdditionalInfo[index] = e.target.value; // Update the specific index
      return { ...prev, additionalInfo: updatedAdditionalInfo };
    });
  }
  else if(name)
  {
    setFormData((prev)=>({...prev,[name]:value}))
  }
  else
  {
    if(e.target.type==="checkbox")
      {
        setFormData((prev)=>({...prev,isActive:!prev.isActive}))
      }
      else
      {
      console.log(e.target.value)
      setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
      console.log(formData)
    }
  }
 }

 

  const handleImageChange = (index, e) => {
    console.log("workng")
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload=()=>{
        const updatedImages = [...images];
        updatedImages[index] = reader.result;
        setImages(updatedImages);
        setShowCropper(index);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleNewAdditionalInputField=()=>{
    setFormData((prev)=>{
      const additional = [...prev.additionalInfo]
      additional.push("")
      return {...prev,additionalInfo:additional}
    })

  }

  const handleSubmit=async()=>{
    const validation = validateOtherForms(formData);
        if(Object.values(validation).length>0)
            {
              for(let x of Object.values(validation))
                {
                  reactToastify.error(x,{className: "custom-toast",progressClassName: "custom-progress-bar"});
                  return;
                }
            }
        if(croppedImage.filter(Boolean).length<3)
          {
            reactToastify.error("minimum three images needed to upload",{className: "custom-toast",progressClassName: "custom-progress-bar"})
            return
          }
    setLoading(true)
    if(id)
    {
      try{
        // filtering only blob object discarding the image url that already exists and also matching with index
        const imagesNeededToUpload = croppedImage.map((image,index)=>({[index]:image})).filter((item) => Object.values(item)[0] instanceof Blob)
        const updatedFormData = {...formData, sizes : [
          { size: "S", stock: formData.S },
          { size: "M", stock: formData.M },
          { size: "L", stock: formData.L },
          { size: "XL", stock: formData.XL },
          { size: "XXL", stock: formData.XXL },
        ]}
        const response = await editEntireProduct(id,updatedFormData,imagesNeededToUpload);
        toast.success(response.message)
        navigate('/admin/products')
      }
      catch(error)
      {
        toast.error(error.message)
      }
      setLoading(false)
    }
    else{
      try{
        const updatedFormData = {...formData, sizes : [
          { size: "S", stock: formData.S },
          { size: "M", stock: formData.M },
          { size: "L", stock: formData.L },
          { size: "XL", stock: formData.XL },
          { size: "XXL", stock: formData.XXL },
        ]}
        const response = await formDatasubmission(croppedImage,updatedFormData,"products")
        toast.success(response.message)
        navigate('/admin/products')
      }
      catch(error)
      {
        console.log(error.message)
        toast.error(error.message)
      }
      setLoading(false);
    }
  }

    // input fields 
    const InputFields = [{label:"Product Name",type:"text",placeHolder:"eg: Navy Slim Fit Stretch Shirt",id:"name",name:"name",value:formData.name,style:"h-9 w-full"},{label:"Description",type:"text",placeHolder:"eg: This formal shirt ensures delicate balance while choosing fit and plain pattern that works best for you.....",id:"textArea",name:"description",value:formData.description,style:"border-2 border-gray-100 p-2 rounded-lg w-full"},{label:"Price",type:"text",id:"regularPrice",name:"regularPrice",value:formData.regularPrice,style:"h-9 w-50",divStyle:"flex gap-3 items-center float-left me-4"},{label:"Should be Listed:",type:"checkbox",id:"isActive",name:"isActive",value:formData.isActive,style:"accent-black me-2 scale-125" ,divStyle:"w-48 flex justify-around"}]
    const secondLastInputFields = [{label:"color",type:"text",placeHolder:"eg: Navy blue",id:"color",name:"color",value:formData.color,style:"h-9 w-full"},{label:"size of Model wearing shirt",type:"text",placeHolder:"eg: Model wears L sized shirt",id:"sizeOfModel",name:"sizeOfModel",value:formData.sizeOfModel,style:"h-9 w-full"},{label:"wash care",type:"text",placeHolder:"eg: dry clean",id:"washCare",name:"washCare",value:formData.washCare,style:"h-9 w-full"}]
    const additionalInputs = formData.additionalInfo.map((inputValue,index)=>({label:"",type:"text",id:`addInfo${index}`,name:`${index}`,value:inputValue,style:"h-9 w-full"}))
    const sizeInputFields=[{label:"S",type:"number",id:"size",name:"S",value:formData.S,style:"border w-20 ms-2 size-input text-center",divStyle:"md:float-left me-3 ms-1 md:ms-0 "},{label:"M",type:"number",id:"M",name:"M",value:formData.M,style:"border w-20 ms-2 size-input text-center"},{label:"L",type:"number",id:"L",name:"L",value:formData.L,style:"border w-20 ms-2 size-input text-center",divStyle:"md:float-left md:me-3 md:ms-0 ms-2"},{label:"XL",type:"number",id:"XL",name:"XL",value:formData.XL,style:"border w-20 ms-2 size-input text-center"},{label:"XXL",type:"number",id:"XXL",name:"XXL",value:formData.XXL,style:"border w-20 ms-2 size-input text-center",divStyle:"md:ms-10"}]
  return (
    <div className="AdminAddProduct relative h-[200vh] ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      <h1 className="font-bold text-lg">PRODUCT DETAILS</h1>
      {/* first input field div */}
      <div className="inner-shadow-box flex flex-col gap-3 p-10 mt-5">
        <InputComponent InputFields={InputFields} handleInputChange={handleInputChange} formData={formData}/>
      </div>

      {/* second image input div */}
      <div className="flex flex-col items-center gap-6 p-8 inner-shadow-box mt-10">
        <ImageInputComponent ImagesFields={images} handleImageChange={handleImageChange} croppedImage={croppedImage} setCroppedImage={setCroppedImage} showCropper={showCropper} setShowCropper={setShowCropper} isProductImage={true} setImagesFields={setImages} id={id?id:false}/>
      </div>

      {/* third input div */}
      <div className="inner-shadow-box flex gap-3 p-10 mt-5  font-semibold">
        <div className="flex-1 flex flex-col gap-7">
          <div>
            <label>Select Category</label>
            <Select name="category" onValueChange={(value)=>handleInputChange(false,null,value,"category")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={formData?.category?.name||"category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category)=>(
                  <SelectItem key={category._id}  value={category._id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label>Select Sleeves</label>
            <Select name="sleeves" onValueChange={(value)=>handleInputChange(false,null,value,"sleeves")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={formData?.sleeves||"Sleeves"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Sleeves</SelectItem>
                <SelectItem value="half">Half sleeves</SelectItem>
                <SelectItem value="elbow">Elbow sleeves</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label>Select Fit</label>
            <Select name="fit" onValueChange={(value)=>handleInputChange(false,null,value,"fit")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={formData?.fit||"Fit"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular fit</SelectItem>
                <SelectItem value="slim">slim fit</SelectItem>
                <SelectItem value="box">box fit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-14 ">
          <div className="flex flex-col gap-4">
            <h5>Size Available</h5>
            <InputComponent InputFields={sizeInputFields} handleInputChange={handleInputChange} formData={formData}/>
          </div>
        </div>
      </div>

      {/* forth div starts */}
      <div className="inner-shadow-box  p-10 mt-5  font-semibold">
        <div>
          <h3>Products Specifications</h3>
          <InputComponent InputFields={secondLastInputFields} handleInputChange={handleInputChange} formData={formData}/>
        </div>
        <div className="p-5 shadow-lg rounded-lg mt-10">
         
          <h3>Additional Informations</h3>
          <InputComponent InputFields={additionalInputs} handleInputChange={handleInputChange} formData={formData} additionalInfo={true}/>
            <Button className="mt-5" onClick={handleNewAdditionalInputField}>Add Related Informations</Button>
        </div>
        <Button disabled={loading} onClick={handleSubmit}>{id?(loading?<img className='scale-50' src={spinner} alt="Loading..." />:"Update Product"):(loading?<img className='scale-50' src={spinner} alt="Loading..." />:"Add Product")}</Button>
      </div>
      
    </div>
  );
};

export default ManageProduct;


// const AddProduct = () => {
//   const [images, setImages] =  useState([null,null,null]);
//   const [croppedImage,setCroppedImage]=useState([null,null,null]);
//   const [showCropper,setShowCropper] = useState(null);
//   const [categories,setCategories]=useState([]);

//   const [formData,setFormData] = useState({
//     name:"",
//     description:"",
//     regularPrice:0,
//     isActive:true,
//     category:"",
//     sleeves:"",
//     fit:"",
//     S:0,
//     M:0,
//     L:0,
//     XL:0,
//     XXL:0,
//     color:"",
//     sizeOfModel:"",
//     washCare:"",
//     additionalInfo:[]
//   })


//   // useEffects
//   useEffect(()=>{
//     const fetchCategory=async()=>{
//       const categoriesResult=await getCategories();
//       setCategories(categoriesResult.data);
//     }
//     fetchCategory();
//   },[])


//  const handleInputChange=(additionalInfo,e,value,name)=>{
//   if(additionalInfo)
//   {
//     console.log("working")
//     const index = parseInt(e.target.name)
//      setFormData((prev) => {
//       const updatedAdditionalInfo = [...prev.additionalInfo];
//       updatedAdditionalInfo[index] = e.target.value; // Update the specific index
//       return { ...prev, additionalInfo: updatedAdditionalInfo };
//     });
//   }
//   else if(name)
//   {
//     console.log(name,value)
//     setFormData((prev)=>({...prev,[name]:value}))
//   }
//   else
//   {
//     console.log("else is working")
//     if(e.target.type==="checkbox")
//     {
//       setFormData((prev)=>({...prev,isActive:!prev.isActive}))
//     }
//     else
//     {
//       setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
//     }
//   }
//  }

 

//   const handleImageChange = (index, e) => {
//     console.log("workng")
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload=()=>{
//         const updatedImages = [...images];
//         updatedImages[index] = reader.result;
//         setImages(updatedImages);
//         setShowCropper(index);
//       }
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit=async()=>{
//     console.log(formData)
//     try{
//       const response = await formDatasubmission(croppedImage,formData,"products")
//       console.log(response)
//     }
//     catch(error)
//     {
//       console.log(error.message)
//       // toast(error.message)
//     }
//   }

//     // input fields 
//     const InputFields = [{label:"Product Name",type:"text",id:"name",name:"name",style:"h-9 w-full"},{label:"Description",type:"text",id:"description",name:"description",style:"h-28 w-full"},{label:"Price",type:"text",id:"regularPrice",name:"regularPrice",style:"h-9 w-50",divStyle:"flex gap-3 items-center float-left me-4"},{label:"Should be Listed:",type:"checkbox",id:"isActive",name:"isActive",style:"accent-black me-2 scale-125" ,divStyle:"w-48 flex justify-around"}]
//     const secondLastInputFields = [{label:"color",type:"text",id:"color",name:"color",style:"h-9 w-full"},{label:"size of Model wearing shirt",type:"text",id:"sizeOfModel",name:"sizeOfModel",style:"h-9 w-full"},{label:"wash care",type:"text",id:"washCare",name:"washCare",style:"h-9 w-full"}]
//     const [LastinputFields,setLastinputFields] = useState([{label:"",type:"text",id:"addInfo0",name:"0",style:"h-9 w-full"},{label:"",type:"text",id:"addInfo1",name:"1",style:"h-9 w-full"},{label:"",type:"text",id:"addInfo2",name:"2",style:"h-9 w-full"}])
//     const sizeInputFields=[{label:"S",type:"Number",id:"S",name:"S",style:"border w-20 ms-2 size-input text-center",divStyle:"md:float-left me-3 ms-1 md:ms-0 "},{label:"M",type:"Number",id:"M",name:"M",style:"border w-20 ms-2 size-input text-center"},{label:"L",type:"Number",id:"L",name:"L",style:"border w-20 ms-2 size-input text-center",divStyle:"md:float-left md:me-3 md:ms-0 ms-2"},{label:"XL",type:"Number",id:"XL",name:"XL",style:"border w-20 ms-2 size-input text-center"},{label:"XXL",type:"Number",id:"XXL",name:"XXL",style:"border w-20 ms-2 size-input text-center",divStyle:"md:ms-10"}]
//   return (
//     <div className="AdminAddProduct relative h-[200vh] ps-5 md:ps-[300px] pe-5 pt-16">
//       <SideBar />
//       <h1 className="font-bold text-lg">PRODUCT DETAILS</h1>
//       {/* first input field div */}
//       <div className="inner-shadow-box flex flex-col gap-3 p-10 mt-5">
//         <InputComponent InputFields={InputFields} handleInputChange={handleInputChange} formData={formData}/>
//       </div>

//       {/* second image input div */}
//       <div className="flex flex-col items-center gap-6 p-8 inner-shadow-box mt-10">
//         <ImageInputComponent ImagesFields={images} handleImageChange={handleImageChange} croppedImage={croppedImage} setCroppedImage={setCroppedImage} showCropper={showCropper} setShowCropper={setShowCropper} isProductImage={true} setImagesFields={setImages}/>
//       </div>

//       {/* third input div */}
//       <div className="inner-shadow-box flex gap-3 p-10 mt-5  font-semibold">
//         <div className="flex-1 flex flex-col gap-7">
//           <div>
//             <label>Select Category</label>
//             <Select name="category" onValueChange={(value)=>handleInputChange(false,null,value,"category")}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((category)=>(
//                   <SelectItem key={category._id}  value={category._id}>{category.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label>Select Sleeves</label>
//             <Select name="sleeves" onValueChange={(value)=>handleInputChange(false,null,value,"sleeves")}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Sleeves" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="full">Full Sleeves</SelectItem>
//                 <SelectItem value="half">Half sleeves</SelectItem>
//                 <SelectItem value="three">half</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label>Select Fit</label>
//             <Select name="fit" onValueChange={(value)=>handleInputChange(false,null,value,"fit")}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Fit" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="regular">Regular fit</SelectItem>
//                 <SelectItem value="slim">slim fit</SelectItem>
//                 <SelectItem value="box">box fit</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
        
//         <div className="flex-1 flex flex-col gap-14 ">
//           <div className="flex flex-col gap-4">
//             <h5>Size Available</h5>
//             <InputComponent InputFields={sizeInputFields} handleInputChange={handleInputChange} formData={formData}/>
//           </div>
//         </div>
//       </div>

//       {/* forth div starts */}
//       <div className="inner-shadow-box  p-10 mt-5  font-semibold">
//         <div>
//           <h3>Products Specifications</h3>
//           <InputComponent InputFields={secondLastInputFields} handleInputChange={handleInputChange} formData={formData}/>
//         </div>
//         <div className="p-5 shadow-lg rounded-lg mt-10">
         
//           <h3>Additional Informations</h3>
//           <InputComponent InputFields={LastinputFields} handleInputChange={handleInputChange} formData={formData} additionalInfo={true}/>
//             <Button className="mt-5" onClick={()=>setLastinputFields([...LastinputFields,{label:"",type:"text",id:`addInfo${LastinputFields.length}`,name:`${LastinputFields.length}`,style:"h-9 w-full"}])}>Add Related Informations</Button>
//         </div>
//         <Button onClick={handleSubmit}>Add Category</Button>
//       </div>
      
//     </div>
//   );
// };

// export default AddProduct;

