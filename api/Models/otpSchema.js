import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    FormData:{
        type: Object, // Store the entire form data as an object
    },
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
        unique:true,
    },
    createdAt:{
        type:Date,
        default:new Date(),
        index:{expires:'5m'}
    }
})

const otpDB = mongoose.model('otp',otpSchema);

export default otpDB