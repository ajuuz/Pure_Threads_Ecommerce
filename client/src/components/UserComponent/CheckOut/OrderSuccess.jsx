import React from "react";
import { motion } from "framer-motion";

import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const OrderSuccess=({orderData})=> {

  const navigate = useNavigate()

    const formatDate = (date,dateOnly) => {
        let options;
        if(dateOnly)
        {
           options = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            };
        }
        else{
            options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // To use AM/PM
                };
        }
      
        return new Date(date).toLocaleString("en-US", options);
      };

  return (
    <div className="fixed bg-[rgba(0,0,0,0.5)] left-[50%] top-[50%] translate-x-[-50%] z-[1001] translate-y-[-50%] w-full flex text-xs items-center justify-center min-h-screen">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        final
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white  rounded-lg p-6 md:py-6 px-10 w-full max-w-lg "
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-black rounded-full"
          >
            <span className="text-white text-4xl font-bold"><FaCheck/></span>
          </motion.div>
          <h2 className="text-2xl font-semibold  tracking-wider">
            Order Successfully Placed!
          </h2>
          <p className=" mt-2">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-lg font-medium  mb-2">
            Order Details
          </h3>
          <div className="flex justify-between  mb-2">
            <span>Order ID:</span>
            <span className="font-semibold ">
              {orderData.orderId}
            </span>
          </div>
          <div className="flex justify-between ">
            <span>Order Date:</span>
            <span className="font-semibold ">
              {formatDate(orderData.createdAt,false)}
            </span>
          </div>
        </motion.div>

        {/* Delivery Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-lg font-medium  mb-2">
            Delivery Expected By
          </h3>
          <p className=" font-semibold">{formatDate(orderData.deliveryDate,true)}</p>

          <h3 className="text-lg font-medium  mt-4 mb-2">
            Delivery Address
          </h3>
          <div className=" leading-relaxed">
          <h2 className='font-bold'>{orderData?.deliveryAddress?.name||"John Doe"}</h2>
            <p>{orderData?.deliveryAddress?.buildingName||""}</p>
            <p className='truncate'>{`${orderData?.deliveryAddress?.address||""},${orderData?.deliveryAddress?.district||""}`}</p>
            <p>{`${orderData?.deliveryAddress?.landMark||""},${orderData?.deliveryAddress?.city||""}`}</p>
            <p>{orderData?.deliveryAddress?.pinCode||""}</p>
            <p>{orderData?.deliveryAddress?.state||""}</p>
          </div>
        </motion.div>

        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6"
        >
          <h3 className="text-lg font-medium  mb-2">
            Payment Details
          </h3>
          <div className="flex justify-between  mb-2">
            <span>Shipping Fee:</span>
            <span className="font-semibold ">₹0</span>
          </div>
          <div className="flex justify-between ">
            <span>Total Amount:</span>
            <span className="font-semibold ">₹{orderData.totalAmount}</span>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <motion.button
            onClick={()=>navigate('/orders')}
            whileHover={{ scale: 1.05 }}
            className="bg-black text-white hover:bg-gray-900 px-4 py-2 rounded"
          >
            View Orders
          </motion.button>
          <motion.button
            onClick={()=>navigate('/shop')}
            whileHover={{ scale: 1.05 }}
            className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded"
          >
            Continue Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>

  );
}

export default OrderSuccess