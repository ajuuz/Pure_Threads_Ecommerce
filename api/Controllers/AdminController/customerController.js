import UsersDB from "../../Models/userSchema.js";
import { errorHandler } from "../../utils/error.js";

export const getCustomers = async (req,res)=>{
    try{

        const customers = await UsersDB.find();
        return res.status(200).json({success:true,message:"customers fetched successfully",customers})
    }
    catch(error)
    {
        console.log(error)
        next(errorHandler(500,"something went wrong please try again"));
    }
}


export const editCustomers=async(req,res,next)=>{
    console.log("working")
    console.log(req.query.id)
    try{
        if(req.query && req.query.id)
        {
            const id = req.query.id;

            const customer = await UsersDB.findById(id);
            if(!customer) return next(errorHandler(404,"customer not found"))

            const updatedCustomer = await UsersDB.updateOne({_id:id},{$set:{isActive:!customer.isActive}});

            if (updatedCustomer.nModified === 0) {
                return res.status(400).json({ message: "No changes were made" });
              }
             return res.status(200).json({ success:true,message: "User state updated successfully" });
        }
        else
        {
    
        }

    }
    catch(error)
    {

    }
}