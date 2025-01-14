import mongoose from "mongoose";
import categoryDB from "./categorySchema.js";

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
        required:true,
        min:[0,"Regular price cannot be negative"],
    },
    salesPrice:{
        type:Number,
        required:true,
        min:[0,"Sales price cannot be negative"]
    },
    takenOffer:{
        offerValue:{type:Number,default:0},
        offerType:{type:String}
    },
    offer:{
        offerValue:{type:Number,default:0,min:[0,"Offer value cannot be negative"]},
        offerType:{type:String},
        offerPrice:{type:Number,min:[0,"Offer price cannot be negative"]}
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
        stock: { type: Number, required: true ,min:[0,"Stock cannot be negative"]},
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
{ timestamps: true })


productSchema.pre("updateOne", async function (next) {
    try{

        const update = this.getUpdate(); // Retrieves the update object
        const query = this.getQuery();  // Retrieves the filter/query object
        if (update && update?.offer?.offerValue) {
        const product = await this.model.findOne(query); // Retrieves the document based on the query
        const {regularPrice} = product
        const category = await categoryDB.findOne({_id:product.category}); 
        
        let productSalesPrice=update.offer.offerPrice;
        let categorySalesPrice;
        categorySalesPrice = regularPrice - regularPrice*(category?.offer?.offerValue)/100 

        const salesPrice = Math.min(categorySalesPrice,productSalesPrice)

        if(salesPrice<0){
            const error = new Error("Sales price cannot be negative")
            error.name="negativePrice"
            throw error
        }

        product.salesPrice=Math.floor(salesPrice);
        if(categorySalesPrice===salesPrice)
        {
            product.takenOffer = category.offer;
        }
        else
        {
            product.takenOffer = product.offer;
        }
        console.log(product.takenOffer)
        product.save()
        }
        next();
    }
    catch(error)
    {
        next(error)
    }
});


const productDB = mongoose.model('product',productSchema);
export default productDB;