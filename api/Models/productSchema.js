import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    salesPrice:{
        type:Number,
        required:true
    },
    offer:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    },
    images: [
        {
          url: { type: String, required: true },       // URL of the uploaded image
          public_id: { type: String, required: true } ,// Unique identifier from the storage service
          _id:false
        }
      ],
   category:{
        type:mongoose.Schema.ObjectId,
        ref:'category',
        required:true,
   },
   sleeves:{
    type:String,
    required:true
   },
   fit:{
    type:String,
    required:true
   },
   sizes: [
    {
        size: { type: String, required: true },
        stock: { type: Number, required: true ,min:0},
        _id:false,
    }],
    color:{
        type:String,
        required:true
    },
    sizeOfModel:{
        type:String,
        required:true
    },
    washCare:{
        type:String,
        required:true
    },
   additionalInfo:{
    type:[String],
    default:[]
   },
},
{ timestamps: true }  
)

const productDB = mongoose.model('product',productSchema);
export default productDB;