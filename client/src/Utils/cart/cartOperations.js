import { updateCart } from "@/api/User/cartApi"
import { toast } from "sonner"
  
export const incrementQuantity =async (index,cartProduct,cartProducts,setCArtProducts,setIsAvailableProduct,fetchCheckoutAvailableCoupons) =>{
    const productId=cartProduct?.product?._id; 
    const size = cartProduct?.size;
    const quantity = cartProduct?.quantity;

    if(quantity>=5) return toast.warning("maximum quantity reached")
    const sizeObject = cartProduct?.product?.sizes.find(item=>item.size===size)
    try{
        const updatedCount = quantity+1
         await updateCart(productId,size,updatedCount)
         
         if(fetchCheckoutAvailableCoupons) await fetchCheckoutAvailableCoupons();

         setCArtProducts((prev)=>prev.map((product,ind)=>ind===index?{...product,quantity:updatedCount}:product))

        if(updatedCount>sizeObject?.stock){
          setIsAvailableProduct((prev)=>prev.map((availableProductError,ind)=>ind===index?`remaining stock :${sizeObject.stock}`:availableProductError))
        }

    }
    catch(error){
        console.log(error)
    }
  }
  
export const decrementQuantity =async(index,cartProduct,cartProducts,setCArtProducts,setIsAvailableProduct,fetchCheckoutAvailableCoupons) => {
  const productId=cartProduct?.product?._id; 
  const size = cartProduct?.size;
  const quantity = cartProduct?.quantity;

    if(quantity<=1) return toast.warning("minimum quantity reached")
    const sizeObject = cartProduct?.product?.sizes.find(item=>item.size===size)
    try{
        const updatedCount = quantity-1
        await updateCart(productId,size,updatedCount)

        if(fetchCheckoutAvailableCoupons) await fetchCheckoutAvailableCoupons();

        setCArtProducts((prev)=>prev.map((product,ind)=>ind===index?{...product,quantity:updatedCount}:product))
        
        console.log(sizeObject.stock,updatedCount)

        if(updatedCount<=sizeObject?.stock){
          setIsAvailableProduct((prev)=>prev.map((availableProductError,ind)=>ind===index?false:availableProductError))
        }
    }
    catch(error){
        console.log(error)
    } 
  }

export  const handleRemoveProduct=async(index,productId,size,setCArtProducts,setIsAvailableProduct,fetchCheckoutAvailableCoupons)=>{
    try{
      await updateCart(productId,size)
      if(fetchCheckoutAvailableCoupons) await fetchCheckoutAvailableCoupons();
      setIsAvailableProduct((prev)=>prev.filter((_,ind)=>index!=ind));
      setCArtProducts((prev)=>prev.filter((_,ind)=>index!=ind));
    }
    catch(error){
      console.log(error)
    }
  }