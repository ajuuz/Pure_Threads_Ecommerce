import React, { useEffect, useState } from "react";


// components
import { Button } from "@/components/ui/button";
import SideBar from "@/components/AdminComponent/SideBar";
import InputComponent from "@/components/AdminComponent/Input/InputComponent";
import ImageInputComponent from "@/components/AdminComponent/Input/ImageInputComponent";
import { formDatasubmission } from "@/Utils/formDataSubmission";
import { useNavigate, useParams } from "react-router-dom";
import { editEntireCategory, getParticularCategory } from "@/api/Admin/categoryApi";


// implementing toast for messages
import { toast } from "sonner"

// for showing loading 
import spinner from '../../../assets/Spin@1x-1.0s-200px-200px.svg'


const AddCategory = () => {

    // useStates
  const [image, setImage] = useState([null]);
  const [croppedImage,setCroppedImage]=useState([null]);
  const [showCropper,setShowCropper] = useState(false);

  // for showing loading 
  const [loading,setLoading] = useState(false)

  const navigate = useNavigate()

  const {id} = useParams();



  const [formData,setFormData] = useState({
    name:"",
    description:"",
    isActive:true,
  })
    

// useEffect
  useEffect(()=>{
    if(id)
    {
    const fetchCategory=async()=>{
      const categoryResult = await getParticularCategory(id);
      setFormData(categoryResult.category)
      const imageURL=[categoryResult.category.images[0].url];
      setImage(imageURL)
      setCroppedImage(imageURL)
    }
    fetchCategory();
    }
  },[])

    // functions
  const handleImageChange = (index,e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      const reader = new FileReader();
      reader.onload=()=>{
        setImage([reader.result]);
        setShowCropper(index);
      }
      reader.readAsDataURL(file);
    }
  };

  

  const handleInputChange = (arg1, e = {}, arg2, arg3) => {
    const { name, type, checked, value } = e.target; // Destructure properties from the event target
  
    if(type==='checkbox')
    {
      setFormData((prev) => ({
        ...prev,
        isActive:!prev.isActive, // Handle checkboxes vs. other inputs
      }));
    }
    else{
      setFormData((prev) => ({
        ...prev,
        [e.target.name]:e.target.value, // Handle checkboxes vs. other inputs
      }));
    }
  };
  

  const handleSubmit=async()=>{
    setLoading(true)
    if(id)
    {
      try{
        console.log(croppedImage)
        const imagesNeededToUpload=croppedImage[0] instanceof Blob ? [croppedImage[0]] :[];
        const response = await editEntireCategory(id,formData,imagesNeededToUpload)
        toast.success(response.message)
        navigate('/admin/categories')
        setLoading(false)
      }
      catch(error)
      {
        console.log(error.message)
        toast(error.message)
        setLoading(false)
      }
    }
    else
    {
      console.log(formData)
      try{
        const response = await formDatasubmission(croppedImage,formData,"categories")
        console.log(response.message)
        toast.success(response.message)
        navigate('/admin/categories')
        setLoading(false)
      }
      catch(error)
      {
        console.log(error.message)
        toast(error.message)
        setLoading(false)
      }
    }
  }


  // input fields 
  const InputFields = [{label:"Category Name",type:"text",id:"name",name:"name",value:formData.name,style:"h-9 w-full"},
    {label:"Description",type:"text",id:"textArea",name:"description",value:formData.description,style:"border-2 border-gray-100 p-2 rounded-lg w-full"},
    {label:"Should be Listed:",type:"checkbox",id:"isActive",name:"isActive",value:formData.isActive,style:"accent-black me-2 scale-125"}]


  return (
    
    <div className="AdminAddCategory relative h-[200vh] ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      
      <h1 className="font-bold text-lg">CATEGORY DETAILS</h1>

      {/* first div */}
      <div className="flex flex-col  items-center gap-6 p-8 inner-shadow-box mt-10">
        <h1 className="font-bold text-lg">Header Image</h1>
        <ImageInputComponent ImagesFields={image} handleImageChange={handleImageChange} croppedImage={croppedImage} setCroppedImage={setCroppedImage} showCropper={showCropper} setShowCropper={setShowCropper} isProductImage={false}/>
      </div>
      {/* first div ends */}
    

      {/* second div */}
      <div className="inner-shadow-box flex flex-col gap-3 p-10 mt-5">
        <InputComponent InputFields={InputFields} handleInputChange={handleInputChange} formData={formData}/>
      </div>
      {/* second div ends */}
      
      <Button disabled={loading} onClick={handleSubmit}>{loading?<img className='scale-50' src={spinner} alt="Loading..." />:"ADD CATEGORY"}</Button>
      
    </div>
  );
};

export default AddCategory;
