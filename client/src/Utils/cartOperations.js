import { updateCart } from "@/api/User/cartApi"

  
export const incrementQuantity =async (index,cartProduct,productId,size,quantity,cartProducts,setCArtProducts,setIsAvailableProduct) =>{
    if(quantity>=5) return
    const sizeObject = cartProduct?.product?.size.find(item=>item.size===size)
    console.log(sizeObject)
    try{
        const updatedCount = quantity+1
         await updateCart(productId,size,updatedCount)
        const updatedArray = [...cartProducts]
        updatedArray[index].quantity = quantity+1;

        if(updatedCount>sizeObject?.stock){
          setIsAvailableProduct((prev)=>{
            const updatedIsAvaiableProductArray = [...prev]
            updatedIsAvaiableProductArray[index] = `remaining stock :${sizeObject.stock}`
            return updatedIsAvaiableProductArray
          })
        }

        setCArtProducts(updatedArray)//settting the incremented value
    }
    catch(error){
        console.log(error)
    }
  }
  
export const decrementQuantity =async(index,cartProduct,productId,size,quantity,cartProducts,setCArtProducts,setIsAvailableProduct) => {
    if(quantity<=1) return
    const sizeObject = cartProduct?.product?.size.find(item=>item.size===size)
    console.log(sizeObject)
    try{
        const updatedCount = quantity-1
        console.log(updatedCount,sizeObject.stock)
        await updateCart(productId,size,updatedCount)
        const updatedArray = [...cartProducts]
        updatedArray[index].quantity = quantity-1;
        if(updatedCount<=sizeObject?.stock){
          setIsAvailableProduct((prev)=>{
            const updatedIsAvaiableProductArray = [...prev]
            updatedIsAvaiableProductArray[index] = false
            return updatedIsAvaiableProductArray
          })
        }
        setCArtProducts(updatedArray)
    }
    catch(error){
        console.log(error)
    } 
  }

export  const handleRemoveProduct=async(index,productId,size,cartProducts,setCArtProducts,isAvailableProduct,setIsAvailableProduct)=>{
    try{
      await updateCart(productId,size)

      const updatedCartProductsArray = [...cartProducts]
      const updatedIsAvaiableProductArray = [...isAvailableProduct]

      updatedIsAvaiableProductArray.splice(index,1) //removing the cart product from front end 
      updatedCartProductsArray.splice(index,1) //removing the error of the product from the front end

      setIsAvailableProduct(updatedIsAvaiableProductArray)
      setCArtProducts(updatedCartProductsArray)

    }
    catch(error){

    }
  }