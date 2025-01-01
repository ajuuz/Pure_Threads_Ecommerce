import { getCartProducts } from "@/api/User/cartApi";

export const fetchCartProducts = async ()=>{
    try{
        const fetchCartProductsResult = await getCartProducts();
        const fetchedProductArray = fetchCartProductsResult?.cartProducts || []
        const isAvailableReducer = fetchedProductArray.reduce((acc,curr)=>{
          const sizeObject = curr?.product?.sizes.find(item=>item.size===curr?.size)
           if(!curr?.product?.isActive)
          {
            acc.push("product is currently not available")
          }
          else if(sizeObject.stock<curr.quantity){
            const remainingStock = sizeObject.stock
            acc.push(`remaining stock :${remainingStock}`)
          }
          else{
            acc.push(null)
          }
          return acc
        },[])
        return {isAvailableReducer,fetchedProductArray}
        
    }catch(error){
       throw error;
    }
}