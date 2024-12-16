import React, { useEffect, useState } from "react";

// components
import InputComponent from "@/components/AdminComponent/Input/InputComponent";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/UserComponent/NavBar/NavBar";
import SideBar from "@/components/UserComponent/SideBar/SideBar";

//utility
import {  validateOtherForms } from "@/Utils/formValidation";

// icons
import { FaRegEdit } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";


// toaster
import { toast } from "sonner";
import { toast as reactToastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// apis
import { addAddress, editAddress, getAddress } from "@/api/User/addressApi";
import { useLocation, useNavigate,useParams } from "react-router-dom";

const ManageAddress = () => {
// states
    const [formData,setFormData] = useState({
        name:"",
        email:"",
        buildingName:"",
        address:"",
        district:"",
        state:"",
        city:"",
        pinCode:"",
        landMark:""
    })
    const [editMode,setEditMode] = useState(true);

    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {from} = location.state || {}
    
    // useEffects
    useEffect(()=>{
        if(id){
            const fetchParticluarAddress = async()=>{
                try{
                    const addressResult = await getAddress(id);
                    setFormData(addressResult.address)
                }
                catch(error){
                    toast.error(error.message);
                }
            }
            fetchParticluarAddress();
        }
    },[])

// functions
    const handleInputChange=(arg1,e,arg2,arg3)=>{
        setFormData((prev)=>(
            {...prev,
                [e.target.name]:e.target.value
            }
        ))
    }

    const handleSubmit =async ()=>{
    
        const validation = validateOtherForms(formData);
        if(Object.values(validation).length>0)
            {
              for(let x of Object.values(validation))
                {
                  reactToastify.error(x,{className: "custom-toast",progressClassName: "custom-progress-bar"});
                  return;
                }
            }
            
        if(id)
        {
            try{
                const addAddressResult = await editAddress(formData,id);
                toast.success(addAddressResult.message)
                navigate(from)
            }
            catch(error)
            {
                toast.error(error.message)
            }
        }
        else{
            try{
                const addAddressResult = await addAddress(formData);
                toast.success(addAddressResult.message)
                navigate(from)
            }
            catch(error)
            {
                toast.error(error.message)
            }
        }
        
    }

 

    const InputFields = [
        { label: "Full Name", type: "text", placeHolder: "Eg: John Doe", id: "name", name: "name",value:formData.name, style: `h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
        { label: "Email", type: "text", placeHolder: "johnDoe@gmail.com", id: "email", name: "email",value:formData.email,style: `h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
        { label: "Building Name,House Name or Flat name", type: "text", placeHolder: "Brototype", id: "buildingName", name: "buildingName",value:formData.buildingName,style: `h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
        { label: "Land Mark", type: "text", placeHolder: "Eg: Near Lulu Mall", id: "landMark", name: "landMark",value:formData.landMark,style: `h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
        { label: "Address", type: "text", placeHolder: "123, Palm Street, Green Valley", id: "textArea", name: "address",value:formData.address,style: `border-2 border-gray-100 p-2 rounded-lg w-full ${editMode && "border-none text-slate-400"}`, divStyle: "col-span-2",disabled:id && editMode},
        { label: "District", type: "text", placeHolder: "Eg: Ernakulam", id: "district", name: "district",value:formData.district,style:`h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
        { label: "State", type: "text", placeHolder: "Eg: Kerala", id: "state", name: "state",value:formData.state,style:`h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
        { label: "City", type: "text", placeHolder: "Eg: Kochi", id: "city", name: "city",value:formData.city,style:`h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
        { label: "Pin Code", type: "text", placeHolder: "Eg: 682001", id: "pinCode", name: "pinCode",value:formData.pinCode,style:`h-9 w-full  ${editMode && "border-none"}`,disabled:id && editMode},
      ];
      

  return (
    <>
    <div className="md:ps-[340px]  pt-28">
      <NavBar />
      {from==="/address" && <SideBar current="address" />}
      <div className="py-7 px-10 shadow-[rgba(0,0,0,0.1)_0px_0px_10px_1px] rounded-xl w-[90%]">
        <div className="mb-6">
            <div className="flex justify-between items-center">
                <h4 className=" text-2xl font-bold">Add New Address</h4>
                <h6 className=" text-lg font-semibold">Personal Information</h6>
                {id && <div onClick={()=>setEditMode(!editMode)}>
                    {editMode?<FaRegEdit className="text-lg"/>:<IoCloseCircle className="text-xl"/>}
                </div>}
            </div>
            <hr className="border-2 border-black "/>
        </div>
        <InputComponent InputFields={InputFields}  handleInputChange={handleInputChange} outerDivStyle="grid grid-cols-2 gap-y-2 gap-x-8"/>
        {id 
        ?!editMode && <Button onClick={handleSubmit}>UPDATE ADDRESS</Button>
        :<Button onClick={handleSubmit}>ADD ADDRESS</Button>
        }
      </div>
    </div>
    </>
  );
};

export default ManageAddress;
