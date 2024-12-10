import jwt from "jsonwebtoken"

export const generateUserRefreshToken = (res,user)=>{
    const token =  jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"90d",
    });

    res.cookie("userRefreshToken",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: "strict",
        maxAge:  90 * 24 * 60 * 60 * 1000,
    })
}


export const generateAdminRefreshToken = (res,admin)=>{
    const token = jwt.sign({id:admin._id},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"90d"
    });

    res.cookie("adminRefreshToken",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: "strict",
        maxAge:  90 * 24 * 60 * 60 * 1000,
    })
}