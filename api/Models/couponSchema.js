import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    couponCode:{
        type:String,
        unique:true,
        required:true
    },
    couponValue:{
        type:Number,
        default:0
    },
    couponType:{
        type:String,
        default:"%"
    },
    description:{
        type:String,
    },
    maxRedeemable:{
        type:Number,
        default:0
    },
    minimumOrderAmount:{
        type:Number,
        default:0
    },
    maxUsableLimit:{
        type:String,
        default:"no limit"
    },
    perUserLimit:{
        type:Number,
        default:0
    }
})

const couponDB = mongoose.model('coupon',couponSchema);

export default couponDB;