import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    items:[
        {product:{type:mongoose.Schema.ObjectId,required:true},
        quantity:Number}
    ]
})