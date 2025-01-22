import mongoose from "mongoose";

const failedOrderSchema = new mongoose.Schema({

      userId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user' 
        },

      deliveryAddress:{
        type:Object,
        required:true,
      },

      items:[
        {product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true,
            },
        productPrice:Number,
        size:String,
        quantity:Number
        }
        ],
        status: { 
            type: String,
            default: 'Pending'
         },
        
         totalAmount:{
            type:Number,
            required:true
         },

        paymentMethod:{
            type:String,
            required:true,
        },
        paymentStatus:{
          type:String,
          default:"Failed",
        },
        couponUsed:{
          couponCode:{  type:String,  default:"No Coupon Used",},
          couponValue:{  type:Number,  default:0},
          couponType:{ type:String, default:"%"},
          couponDiscount:{ type:Number, default:0},
        },
        expiryDate:{ //only for payment failed orders
          type:Date,
          index:{expires:259200} //3 days
        }
})

const failedOrderDB = mongoose.model('failedorder',failedOrderSchema);
export default failedOrderDB;