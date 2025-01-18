import categoryDB from "../../Models/categorySchema.js";
import { errorHandler } from "../../utils/error.js";


export const addCategory=async(req,res,next)=>{
    console.log(req.body)
    const {isActive,description,imageURLs,name} = req.body;
    try{
        const newCategory = await new categoryDB({
            name,
            description,
            images:imageURLs,
            isActive
        });
        await newCategory.save();
        return res.status(201).json({success:true,message:"new category added successfully"})
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong during adding category"))
    }
}

export const getCategories = async(req,res,next)=>{
    try{
        const {searchQuery}=req.query;
        const filter={};
        if(searchQuery.trim()) filter.name={$regex:searchQuery,$options:'i'};
      
        const categories = await categoryDB.find();
        return res.status(200).json({success:true,message:"categories fetched successfully",data:categories})
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong please try again"))
    }
}

export const getParticularCategory=async(req,res,next)=>{
    try{
        const id = req.params.id;
        const categoryDetails = await categoryDB.findOne({_id:id});
        if(!categoryDetails) return next(errorHandler(404,"category not found"))
            const {name,description,images,isActive} = categoryDetails
        return res.status(200).json({success:true,message:"particular category fetched successfully",category:{name,description,images,isActive}})
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong please try again"))
    }
}

export const editEntireCategory=async(req,res,next)=>{
    const {id} = req.params
    const {image,formData} = req.body
    try{
        const updatedCategory = await categoryDB.updateOne({_id:id},{$set:formData})
        if(image)
        {
            console.log(image)
           const imageUpdate = await categoryDB.updateOne({_id:id},{$set:{'images.0':image}})
           console.log(imageUpdate)
        }
        if (updatedCategory.nModified === 0) return next(errorHandler(400,"No changes made"));
        return res.status(200).json({ success:true,message: "category updated successfully" });
    }
    catch(error)
    {
        next(errorHandler(500,"something went wrong please try again"))

    }
}



export const patchCategory=async(req,res,next)=>{
    const categoryId = req.params.categoryId;
    if(req.body?.offerType)
    {
        const offer = req.body
        if(offer.offerType==="%" && offer.offerValue>100) return next(errorHandler(400,"Offer Value should be between 0-100%"))
            
        await categoryDB.updateOne({_id:categoryId},{offer:offer},{ runValidators: true })
        .then((updatedCategory)=>{
            if(updatedCategory.matchedCount===0) return next(errorHandler(404,"category not found"));
            if(updatedCategory.modifiedCount===0) return next(errorHandler(400,"no updation made"));
            return res.status(200).json({success:true,message:"category offer updated successfully"});
        })
        .catch((error)=>{
            if(error.name==="ValidationError"){
                const {type,path}=Object.values(error.errors)[0].properties;
                console.log(path)
                if(type==="min"){
                    if(path==="offer.offerValue") return next(errorHandler(400,"Offer value cannot be negative"))
                }
            }
            return next(errorHandler(500,"something went wrong please try again"));
        })
    }
    else
    {
        try{
            const category = await categoryDB.findById(categoryId);
            if(!category) return next(errorHandler(404,"category not found"))
                const updatedCategory = await categoryDB.updateOne({_id:categoryId},{$set:{isActive:!category.isActive}});
            
            if (updatedCategory.modifiedCount === 0)  return res.status(400).json({ message: "No changes were made" });
            return res.status(200).json({ success:true,message: "Category updated successfully" });
        }
        catch(error)
        {
            next(errorHandler(500,"something went wrong please try again"))
        }
    }
}