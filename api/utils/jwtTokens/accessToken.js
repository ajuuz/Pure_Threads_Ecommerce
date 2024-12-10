import jwt from "jsonwebtoken";

export const generateUserAccessToken = (res,user)=>{
    const token =  jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"1m",
    });

    res.cookie("userAccessToken",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: "strict",
        maxAge: 1 * 60 * 1000,
    })
}

export const generateAdminAccessToken = (res,admin)=>{
    const token = jwt.sign({id:admin._id},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"1m"
    })

    res.cookie("adminAccessToken",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: "strict",
        maxAge: 1 * 60 * 1000,
    })
}