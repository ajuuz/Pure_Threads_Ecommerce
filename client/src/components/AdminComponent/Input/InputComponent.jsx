import React from "react";
import { Input } from "@/components/ui/input";



const InputComponent = ({ InputFields ,handleInputChange,formData,additionalInfo,outerDivStyle}) => {



  return (
    <div className={outerDivStyle}>
      {InputFields.map((input) =>(
        <div className={`${input.type==="checkbox"?"flex items-center gap-2":""} mb-3 ${input.divStyle}`}>
          <label className="font-semibold" htmlFor={input.id}>{input.label}</label>
          {input.id==="textArea" 
          ? <textarea className={`${input.style} placeholder:text-sm`} placeholder={input.placeHolder} 
          value={input.value}
          id={input.id}
          onChange={(e)=>handleInputChange(false,e,null,null)} 
          name={input.name}
          disabled={input?.disabled ? input.disabled:false}
          />
          :<Input placeHolder={input.placeHolder}
           type={input.type}
           disabled={input?.disabled ? input.disabled:false}
           checked={input.type==="checkbox"||input.type==="radio"?formData.isActive:undefined} 
           id={input.id} name={input.name} 
           value={input.value} 
           className={`${input.style} placeholder:text-xs placeholder:text-gray-400 placeholder:font-semibold`} 
           onChange={additionalInfo?(e)=>handleInputChange(true,e,null,null):(e)=>handleInputChange(false,e,null,null)}
           />
        }
        </div>
      ))}
    </div>
  );
};

export default InputComponent;

