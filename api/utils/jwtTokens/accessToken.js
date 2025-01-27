import jwt from "jsonwebtoken";

export const generateUserAccessToken = (res,user)=>{
    const token =  jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"1m",
    });

    res.cookie("userAccessToken",token,{
        httpOnly: false,
        secure: false,
        sameSite: "none",
        maxAge: 1 * 60 * 1000,
    })
}

export const generateAdminAccessToken = (res,admin)=>{
    const token = jwt.sign({id:admin._id},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"1m"
    })

    res.cookie("adminAccessToken",token,{
        httpOnly: false,
        secure: false,
        sameSite: "none",
        maxAge: 1 * 60 * 1000,
    })
}