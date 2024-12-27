import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    buildingName:{
        type:String,
    },
    address:{
        type:String,
        required:true,
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    pinCode:{
        type:Number,
        required:true,
    },
    landMark:{
        type:String,
        required:true,
    },
    
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,
    },
    isDefault:{
        type:Boolean,
        default:false,
    }
})

addressSchema.pre("updateOne", async function (next) {
    const update = this.getUpdate(); // Retrieves the update object
    const query = this.getQuery();  // Retrieves the filter/query object
    console.log(update)
    if (update && update.isDefault === true) {
        const docThatUpdate = await this.model.findOne(query); // Retrieves the document based on the query
        if (docThatUpdate) {
            await this.model.updateMany(
                { userId: docThatUpdate.userId, _id: { $ne: docThatUpdate._id } },
                { $set: { isDefault: false } }
            );
        }
    }
    next();
});


const addressDB = mongoose.model('addresses',addressSchema);

export default addressDB