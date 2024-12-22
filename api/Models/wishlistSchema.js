import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    items:[
        {
            type: mongoose.Schema.ObjectId,
            ref: "product",
            required: true
        }
        ]
})

const wishlistDB = mongoose.model('wishlist',wishlistSchema);
export default wishlistDB;
