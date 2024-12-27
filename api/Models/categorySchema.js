import mongoose from "mongoose";
import productDB from "./productSchema.js";

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
        offerValue:{type:Number,default:0,},
        offerType:{type:String}
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

categorySchema.pre("updateOne", async function(next){

    const update = this.getUpdate(); // Retrieves the update object
    const query = this.getQuery();  // Retrieves the filter/query object
    if(update && update?.offer?.offerValue)
    {
        const categoryOffer = update.offer;
        const categoryId = query._id
        const products = await productDB.find({category:categoryId});
        
        for(let product of products)
        {
            const productSalesPrice = product.offer.offerPrice;
            const categorySalesPrice = product.regularPrice - product.regularPrice*categoryOffer.offerValue/100;
            const salesPrice = Math.min(productSalesPrice,categorySalesPrice);
            if(salesPrice<0) throw new Error("some of your products price goes to negative");
            if(categorySalesPrice===salesPrice)
            {
                product.takenOffer = categoryOffer;
            }
            else
            {
                product.takenOffer = product.offer;
            }
            product.salesPrice = Math.floor(salesPrice);
            product.save()
        }
    }
    next()
})


const categoryDB = mongoose.model('category',categorySchema);
export default categoryDB