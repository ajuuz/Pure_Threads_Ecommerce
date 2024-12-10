import mongoose from "mongoose";

const AdminSchema =new mongoose.Schema({
    email:{
        type:String,
    },
    password:{
        type:String
    }
})

const AdminDB = mongoose.model('admin',AdminSchema);

export default AdminDB;