import { getProducts } from "@/api/User/productApi";
import Card from "@/components/UserComponent/Card/Card";
import FilterComponent from "@/components/UserComponent/FilterComponent/FilterComponent";
import NavBar from "@/components/UserComponent/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
const ShopPage = () => {

   const [products,setProducts] = useState([])

   const navigate = useNavigate()

   useEffect(()=>{
    const fetchProducts=async()=>{
        try{
            const sort=null
            const productsResult = await getProducts(sort)
            setProducts(productsResult.products)
        }
        catch(error)
        {
            console.log(error)
        } 
    }
    fetchProducts();
   },[])

//    functions
const onCardClick=(id)=>{
    console.log("hlo")
    navigate(`/products/${id}`)
}

  return (
    <div className="h-[200vh] relative pt-[120px] lg:ps-[350px]">
      <NavBar />
      <main className="flex">
        <aside className="border-2 hidden  lg:flex flex-col gap-1 fixed top-[100px] left-5 bg-white shadow-lg rounded-lg w-[300px] p-5">
           <FilterComponent/>
        </aside>
        <motion.div className="grid mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-5 md:gap-5 lg:gap-4 xl:gap-4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
              {products.map((product)=>(
                <Card image1={product.images[0].url} title={product.name} category={product?.category.name} price={product.salesPrice} withDescription={true} onCardClick={()=>onCardClick(product?._id)}/>
               ))}
          </motion.div>
        
      </main>
    </div>
  );
};

export default ShopPage;
