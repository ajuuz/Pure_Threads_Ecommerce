import React, { useEffect, useState } from "react";



import Carousel from "@/components/UserComponent/Carousel/Carousel.jsx";
import NavBar from "@/components/UserComponent/NavBar/NavBar";
import Card from "@/components/UserComponent/Card/Card";

import Footer from "@/components/UserComponent/Footer/Footer";
import { getProducts } from "@/api/User/productApi";
import { getCategories } from "@/api/User/CategoryApi";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

    const [newArrivals,setNewArrivals] = useState([])
    const [trending,setTreding] = useState([])
    const [categories,setCategories] = useState([])

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchProducts=async()=>{
            try{
                const sort=JSON.stringify({createdAt:-1})
                const limit = 5;
                const currentPage=1
                const category=[];
                const fit=[];
                const sleeves=[];
                const searchQuery =""
                const productsResult = await getProducts(sort,limit,currentPage,category,fit,sleeves,searchQuery)
                setNewArrivals(productsResult.products)
            }
            catch(error)
            {
                console.log(error)
            } 
        }
        fetchProducts();
        const fetchCategories=async()=>{
            try{
                const categoriesResult = await getCategories();
                setCategories(categoriesResult.categories)
            }
            catch(error)
            {
                console.log(error.message)
            }
        }
        fetchCategories()

    },[])

    //    functions
const onCardClick=(id)=>{
    navigate(`/products/${id}`)
}

  return (
    <div className="h-[200vh] relative pt-24">
      <NavBar />
      <div className="p-8">
      <Carousel/>
      </div>

       <div className="mt-5">
           <div className="flex flex-col items-center">
            <h2 className="font-serif text-center text-xl">NEW ARRIVALS</h2>
            <p className="text-center w-[50%]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam mollitia qui ut molestiae voluptatum possimus rem. Blanditiis debitis similique dignissimos vero qui, modi officiis nam soluta! Veniam nesciunt aliquam nulla?</p>
           </div>

           <div className="card-container flex gap-5 justify-center overflow-x-auto  pt-4 pb-10 rounded-xl">
              {newArrivals.map((product) => (
              <Card key={product?._id} image1={product?.images[0].url} image2={product?.images[1].url}  onCardClick={()=>onCardClick(product?._id)}/>
              ))}
           </div>

       </div>

       <div >
        <img src={categories[0]?.images[0]?.url} alt={categories[0]?.name} className="w-full"/>
       </div>
      
       <div className="mt-5">
           <div className="flex flex-col items-center">
            <h2 className="font-serif text-center text-xl">TRENDINGS</h2>
            <p className="text-center w-[50%]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam mollitia qui ut molestiae voluptatum possimus rem. Blanditiis debitis similique dignissimos vero qui, modi officiis nam soluta! Veniam nesciunt aliquam nulla?</p>
           </div>

           <div className="card-container flex gap-5 justify-center overflow-x-auto  pt-4 pb-10 rounded-xl">
              {newArrivals.map((product) => (
              <Card key={product?._id} image1={product?.images[0].url} image2={product?.images[1].url}  onClick={() => alert(`You clicked on `)}/>
              ))}
           </div>
           
       </div>

       <div className="mb-10">
       <img src={categories[1]?.images[0]?.url} alt={categories[1]?.name} className="w-full"/>
       </div>

       <Footer/>
    </div>
  );
};

export default LandingPage;
