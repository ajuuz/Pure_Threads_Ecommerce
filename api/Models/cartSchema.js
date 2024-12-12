import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    items:[
        {product:{
            type:mongoose.Schema.ObjectId,
            ref:"product",
            required:true,
            },
        size:String,
        quantity:Number}
        ]
})

const cartDB =  mongoose.model('cart',cartSchema);
export default cartDB;