import couponDB from "../../Models/couponSchema.js"
import UsersDB from "../../Models/userSchema.js";
import { refreshTokenDecoder } from "../../utils/jwtTokens/decodeRefreshToken.js";
import { errorHandler } from "../../utils/error.js";
export const couponActivation=async(req,res,next)=>{
    const {isPaymentFailed} = req.body;
    
    if(isPaymentFailed){
        req.body.paymentStatus="Failed"
        next();
        return
    }

    try{
        const userId = refreshTokenDecoder(req);
        const {selectedCoupon,couponDiscount} = req.body;
        let couponUsed={couponCode:"No Coupon Used",couponValue:0,couponType:"%"};
        
        if(!selectedCoupon)
        {
            req.body.couponUsed=couponUsed;
            next();
            return
        }
        
        if(selectedCoupon)
            {
            couponUsed.couponCode=selectedCoupon.couponCode;
            couponUsed.couponValue=selectedCoupon.couponValue;
            couponUsed.couponType=selectedCoupon.couponType;
            couponUsed.couponDiscount = couponDiscount
        }

        const couponDetails = await couponDB.findOne({couponCode:selectedCoupon?.couponCode,
                                                    $or:[
                                                        {"maxUsableLimit.isLimited":false},
                                                        {"maxUsableLimit.limit":{$gt:0}}
                                                        ]});
        if(!couponDetails) return next(errorHandler(404,"your selected coupon is either expired or limit has been reached"))
        
        const user = await UsersDB.findOne({_id:userId});
        const couponExist=user?.usedCoupons.find(coupon=>coupon.couponCode===couponDetails.couponCode)

        if(couponExist && couponExist?.usedCount>=couponDetails?.perUserLimit) return next(errorHandler(400,"your usage limit for this coupon is finished"))
        
        if(couponDetails?.maxUsableLimit?.isLimited){
            await couponDB.updateOne({couponCode:couponDetails?.couponCode},{$inc:{"maxUsableLimit.limit":-1}})
        }

        if(couponExist){
            couponExist.usedCount++;
        }
        else{
            user?.usedCoupons.push({couponCode:couponDetails.couponCode,usedCount:1})
        }
        await user.save()
        req.body.couponUsed=couponUsed
        next();
    }
    catch(error)
    {
        console.log(error.message)
        return next(errorHandler(500,"something went wrong during activation of coupon"))
    }
}