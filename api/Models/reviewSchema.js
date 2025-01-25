import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true
    },
    imageURLs: [
        {
          url: {type:String},
          public_id: {type:String}
        },
    ],
    helpfulUsers:[String]
},{timestamps:true})

const reviewDB = mongoose.model('review',reviewSchema);
export default reviewDB;