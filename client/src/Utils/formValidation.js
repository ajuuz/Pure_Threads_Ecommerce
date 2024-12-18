export const validateUserDetailsForm = (formData)=>{
    let formErrors={}
    for(let i in formData)
    {  
        //name
        if (i==='name' && (formData[i]===null||formData[i]==="")) {
            formErrors[i] = "Name is required";
          }
          else if(i==="name" && /^[A-Za-z\s]{3,20}$/.test(formData[i])===false){
            formErrors[i] = "Name must contain only letters and at least 2 characters. format"
          }
          

        //phone
        if(i==="phone" && (formData[i]===null||formData[i]==="")){
            formErrors[i] = "Phone number is required";
        }else if(i==="phone" && /^\d{10}$/.test(formData[i])===false){
            formErrors[i] = "Phone number must be 10 digits."
        }


        //email
        if (i==="email" && (formData[i]===null||formData[i]==="")) {
            formErrors[i] = "Email is required";
          }else if(i==="email" && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData[i])===false){
            formErrors[i] = "Please enter a valid email address in the format: username@domain.com."
          }

        //password
        if (i==='password' && (formData[i]===null||formData[i]==="")) {
            formErrors[i] = "Password is required";
          }else if(i==='password' && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData[i])===false){
            formErrors[i] = "At least 8 characters, includes uppercase, lowercase, digit, and special character."
          }

        //password
        if (i==='confirmPwd' && (formData[i]!==formData.password)) {
            formErrors.confirmPwd = "re Enter correct password";
          } 
          
    }
    return formErrors
}


export const validateOtherForms = (formData)=>{
  let formErrors={};
  console.log(formData)
  for(let i in formData)
  {
    if (i === "email") {
      if (formData[i] === null || formData[i] === "") {
        formErrors[i] = "Email is required";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData[i])) {
        formErrors[i] = "Please enter a valid email address in the format: username@domain.com.";
      }
    }

    //name
    if (i ==="name") {
        if (formData[i]===null||formData[i]==="") {
            formErrors[i] = "Name is required";
          }
          else if(/^[A-Za-z\s]{3,}$/.test(formData[i])===false){
            formErrors[i] = "Name must contain only Alphabets and at least 3 characters."
          }
    }

    // Validate regularPrice
    else if (i === "regularPrice") {
      if (formData[i] === null || formData[i] === "") {
        formErrors[i] = "Price number is required";
      } else if (!/^\d{0,5}$/.test(formData[i])) {
        formErrors[i] = "Price must be between Rs 0-99999.";
      }
    }

    // Validate phone
    else if (i === "phone") {
      if (formData[i] === null || formData[i] === "") {
        formErrors[i] = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData[i])) {
        formErrors[i] = "Phone number must be 10 digits.";
      }
    }

    // Validate pinCode
    else if (i === "pinCode") {
      if (formData[i] === null || formData[i] === "") {
        formErrors[i] = "Pin code is required";
      } else if (!/^\d{6}$/.test(formData[i])) {
        formErrors[i] = "Pin code must be 6 numbers.";
      }
    }

    // Generic validation for other fields
    else if (formData[i] === null || formData[i].toString().trim() === "") {
      formErrors[i] = `${i} field should not be empty`;
    }
  }
  return formErrors;
  }
