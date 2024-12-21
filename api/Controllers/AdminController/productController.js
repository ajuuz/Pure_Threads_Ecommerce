import productDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";0

export const addProduct = async (req, res,next) => {
    const formData = req.body;
    const data = {...formData,images:formData.imageURLs,salesPrice:formData.regularPrice}
    try{
        const newProduct = await new productDB(data)
        await newProduct.save();
        res.status(201).json({success:true,message:"new product added successfully"});
    }
    catch(error)
    {
        if(Object.values(error.errors)[0].properties.type==="min")
        {
           return next(errorHandler(500,"stock cannot be less than zero (0)"))
        }
        next(errorHandler(500,"something went wrong during adding product"))

    }
};

// to fetch all the products
export const getProducts =async (req,res,next)=>{
    try{
        const products = await productDB.find().populate('category')
        return res.status(200).json({success:true,message:"products fetched successfully",data:products})
    }
    catch(error)
    {
        console.log(error)
        next(errorHandler(500,"something went wrong during gettting products"))
    }
}

// to fetch specific product with id
export const getParticularProduct = async(req,res,next)=>{
    const id = req.params.id;
    try{
        const productDetails = await productDB.findOne({_id:id})
        if(!productDetails) return next(errorHandler(404,"product not found"))
        console.log(productDetails)
        const {sizes,...rest} = productDetails.toObject()
        const sizeObj={
            "S":sizes[0].stock,
            "M":sizes[1].stock,
            "L":sizes[2].stock,
            "XL":sizes[3].stock,
            "XXL":sizes[4].stock,
        }
        return res.status(200).json({success:true,message:"product fetched successfully",product:{...rest,...sizeObj}})
    }
    catch(error)
    {
        console.log(error)
        next(errorHandler(500,"something went wrong during gettting products"))
    }
}





// to update whole entire product using put method 
export const editEntireProduct=async(req,res,next)=>{
    const id = req.params.id;
    try{
        const {formData,imageURLsWithIndexes} = req.body;
        const updatedProduct = await productDB.updateOne({_id:id},{$set:formData},{ runValidators: true } )
        if(imageURLsWithIndexes.length>0)
        {
            for(const {index,imageURL} of imageURLsWithIndexes)
            {
                const updatedField = `images.${index}`
                await productDB.updateOne({_id:id},{$set:{[updatedField]:imageURL}})
            }
        }
        if (updatedProduct.nModified === 0) return next(errorHandler(400,"No changes made"));
        return res.status(200).json({ success:true,message: "product updated successfully" });
    }
    catch(error)
    {
        if(Object.values(error.errors)[0].properties.type==="min")
        {
           return next(errorHandler(500,"stock cannot be less than zero (0)"))
        }
       return next(errorHandler(500,"something went wrong during gettting products"))
    }
}

// to update part of the specific product using pathc mehtod and id
export const patchProduct=async(req,res,next)=>{
    const id = req.params.id;
    if(!req?.body.index)
    {
        try{
        const product = await productDB.findById(id); //controller for listing and unlisting
        if(!product) return next(errorHandler(404,"Product not found"))
        const updatedProduct = await productDB.updateOne({_id:id},{$set:{isActive:!product.isActive}});

        if (updatedProduct.nModified === 0) return next(errorHandler(400,"No changes made"));
         return res.status(200).json({ success:true,message: "Product updated successfully" });
        }
        catch(error)
        {
            console.log(error)
            next(errorHandler(500,"something went wrong during gettting products"))
        }
    }
    else
    {
        const index = req.body.index    //controller for removing image
        console.log(id,index)
        try{
            await productDB.updateOne({ _id: id },{ $unset: { [`images.${index}`]: "" } });
            const updatedProduct =  await productDB.updateOne({ _id: id },{ $pull: { images: null } });

            if (updatedProduct.nModified === 0) return next(errorHandler(400,"No changes made"));
            return res.status(200).json({ success:true,message: "Image removed successfully" });
        }
        catch(error)
        {
            console.log(error)
            next(errorHandler(500,"something went wrong during gettting products"))
        }
    }
}

