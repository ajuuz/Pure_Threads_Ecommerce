import jwt from 'jsonwebtoken'

export const refreshTokenDecoder = (req)=>{
    const token = req.cookies.userRefreshToken;
    const decode = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
    const id = decode.id;
    return id;
}