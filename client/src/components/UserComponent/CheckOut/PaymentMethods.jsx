import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Wallet, CreditCard, Banknote } from 'lucide-react'
import { Button } from "@/components/ui/button"
import RazorPayButton from "@/components/CommonComponent/RazorPay/RazorPayButton"
import { fetchCartProducts } from "@/Utils/cart/productAvailableChecker"

export function PaymentMethods({isAvailableProduct,setIsAvailableProduct,cartProducts,paymentMethod,setPaymentMethod,amount,handlePlaceOrder}) {

  const preValidationFunction=async()=>{
    try{
      const fetchCartProductsResult = await fetchCartProducts();
      if(fetchCartProductsResult.isAvailableReducer.filter(Boolean).length!==0) {
        setIsAvailableProduct(fetchCartProductsResult.isAvailableReducer)
        return true
      }
    }
    catch(error)
    {
      throw error?.response.data;
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
      <div className="text-sm text-gray-600 mb-4">Select a payment method</div>
      <RadioGroup onValueChange={(value)=>setPaymentMethod(value)} defaultValue="cod" className="space-y-4">
        <div className="flex items-center space-x-3 border rounded-lg p-4">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Cash on Delivery
          </Label>
        </div>
        <div className="flex items-center space-x-3 border rounded-lg p-4">
          <RadioGroupItem value="wallet" id="wallet" />
          <Label htmlFor="wallet" className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet
          </Label>
        </div>
        <div className="flex items-center space-x-3 border rounded-lg p-4">
          <RadioGroupItem value="razorpay" id="razorpay" />
          <Label htmlFor="razorpay" className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Online ( powered by RazorPay)
          </Label>
        </div>
      </RadioGroup>
      {paymentMethod==="razorpay"
      ?<RazorPayButton 
      amount={amount} 
      functionAfterPayment={handlePlaceOrder} 
      paymentFor="order"
      preValidationFunction={preValidationFunction}
      disabled={isAvailableProduct.filter(Boolean).length!==0 || cartProducts.length<1}
      setIsAvailableProduct={setIsAvailableProduct}
      />
      :<Button  
      disabled={isAvailableProduct.filter(Boolean).length!==0 || cartProducts.length<1 || (paymentMethod==="cod" && amount<1500)} 
      onClick={()=>handlePlaceOrder(amount)} >{paymentMethod==="cod" && amount<1500?"Cash On Delivery is available only for 1500 above purchase":"Place Order"}</Button>
      }
    </div>
  )
}
