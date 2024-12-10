import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    images: [
        {
          url: { type: String, required: true },       // URL of the uploaded image
          public_id: { type: String, required: true } ,// Unique identifier from the storage service
          _id:false
        }
      ],
    offer:{
        type:Number,
        default:0,
    },
    maxRedeemable:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

const categoryDB = mongoose.model('category',categorySchema);
export default categoryDB