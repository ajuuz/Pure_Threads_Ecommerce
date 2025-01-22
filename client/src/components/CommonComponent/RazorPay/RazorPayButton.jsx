import { makePayment } from '@/api/User/orderApi';
import { Button } from '@/components/ui/button';

import React from 'react'
import { useRazorpay } from 'react-razorpay';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';


const RazorPayButton = ({amount,functionAfterPayment,handleFailedOrder,paymentFor,preValidationFunction,disabled,buttonContent}) => {
      //razorpay
      const { error, isLoading, Razorpay } = useRazorpay();
      const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const {user}=useSelector((state)=>state.user)
    
    const handleRazorPayment = async () => {
        try {
    
          if(paymentFor==="order"){
            const error = await preValidationFunction()
            if(error) return
          }
          else if(paymentFor==="wallet")
          {
            const error = preValidationFunction();
            if(error) return
          }


          // Make the API call to backend
          const order = await makePayment(amount)
    
          const options = {
            key: RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Pure Threads", 
            description: "Payment for your order", 
            order_id: order.id,
            retry: {
              enabled: false, // This should disable retry
            },
            //verify payment
            // after making the payment 
            handler: async (response) => {
              try {
                const paymentDetails={
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
    
                await functionAfterPayment(paymentDetails)
              } catch (err) {
                // Add onPaymentUnSuccessfull function here
                toast.error("Payment failed: " + err.message);
              }
            },
          
            prefill: {
              name: user.name, // add customer details
              email: user.email, // add customer details
            },
            notes: {
              address: "Pure Threads",
            },
            theme: {
              color: "#3399cc",
            },
          };
          const rzpay = new Razorpay(options);
          // open razorpay window for take the payment
          if(paymentFor==="order")
          {
            rzpay.on('payment.failed',handleFailedOrder);
          }

          rzpay.open(options);
        } catch (err) {
          toast.error("Error creating order: " + err.message);
        }
      };



  return (
    <Button 
    disabled={disabled} 
    onClick={handleRazorPayment}>{buttonContent?buttonContent:"Pay with RozorPay"}
    </Button>
  )
}

export default RazorPayButton
