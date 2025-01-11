import { getProducts } from "@/api/User/productApi";
import Card from "@/components/UserComponent/Card/Card";
import FilterComponent from "@/components/UserComponent/FilterComponent/FilterComponent";
import NavBar from "@/components/UserComponent/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import PaginationComponent from "@/components/CommonComponent/PaginationComponent"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWishlistProducts } from "@/api/User/wishlistApi";


const ShopPage = () => {

  // useStates
   const [products,setProducts] = useState([])
  const [currentPage,setCurrentPage] = useState(1);
  const [numberOfPages,setNumberOfPages] = useState(1);
  const [searchInput,setSearchInput] = useState("")
  const [filterCheckBoxes,setFilterCheckBoxes] = useState({
    category:[],
    fit:[],
    sleeves:[]
  })
  const [selectedValue,setSelectedValue] = useState({label:"newest",sort:{createdAt:-1}})
  const [sort,setSort] = useState({createdAt:-1})
  const [refresh,setRefresh] = useState(false)
  const [wishlisted,setWishlisted] = useState([])

  // router dom
   const navigate = useNavigate()

   useEffect(()=>{
    const fetchProducts=async()=>{
        try{
          const sortCriteria=JSON.stringify(sort)
          const limit=10
          const category = filterCheckBoxes.category;
          const fit = filterCheckBoxes.fit;
          const sleeves = filterCheckBoxes.sleeves
          const searchQuery = searchInput;
          const productsResult = await getProducts(sortCriteria,limit,currentPage,category,fit,sleeves,searchQuery)
          setProducts(productsResult.products)
          console.log(productsResult)
          setNumberOfPages(productsResult.numberOfPages)
        }
        catch(error)
        {
            console.log(error)
        } 
    }
    fetchProducts();
   },[currentPage,refresh,selectedValue])

   useEffect(()=>{
    const fetchWishlistedProducts=async()=>{
      try{
        const onlyIdNeeded=true
      const fetchWishlistedProductsResult = await getWishlistProducts(onlyIdNeeded);
      console.log(fetchWishlistedProductsResult.wishlist.items)
      setWishlisted(fetchWishlistedProductsResult.wishlist.items)
      }catch(error){
      toast.error(error.message)
      }
    }
      fetchWishlistedProducts();
   },[])



//    functions
const onCardClick=(id)=>{
    navigate(`/products/${id}`)
}

const handleSearchInput = (e)=>{
  setSearchInput(e.target.value)
}

const handleFilterCheckBox=(e)=>{
  const { name, value, checked } = e.target;
  
    setFilterCheckBoxes((prev)=>{
      const updatedFilteredCheckBoxes = {...prev}

      if(checked)
      {
        if(!updatedFilteredCheckBoxes[name].includes(value)){
          updatedFilteredCheckBoxes[name]=[...updatedFilteredCheckBoxes[name],value]
        }
      }else
      {
        updatedFilteredCheckBoxes[name] = updatedFilteredCheckBoxes[name].filter((item)=>item!=value)
      }
      return updatedFilteredCheckBoxes;
    })
}

const handleFilterClick=()=>{
  setCurrentPage(1)
  setRefresh(!refresh)
}

const handleSort=(value)=>{
  setSelectedValue(value)
  if(value==="newest")
  {
    setSort({ createdAt: -1 })
  }
  else if(value==="Price: Low to High")
  {
    setSort({ regularPrice: 1 })
  }
  else if(value==="Price: High to Low")
  {
    setSort({ regularPrice: -1 })
  }
  else if(value==="Aa-Zz")
  {
    setSort({ name: 1 })
  }
  else if(value==="Zz-Aa")
  {
    setSort({ name: -1 })
  }
}

  return (
    <div className=" relative pt-[120px] pb-5 lg:ps-[350px] pe-10">
      <NavBar />
      <div className="flex justify-end py-1">
      <Select name="updateStatus" onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`sort by : ${selectedValue.label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
        <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
        <SelectItem value="Aa-Zz">Aa-Zz</SelectItem>
        <SelectItem value="Zz-Aa">Zz-Aa</SelectItem>
      </SelectContent>
    </Select>
      </div>
      <main className="flex">
        <aside className="border-2 hidden  lg:flex flex-col gap-1 fixed top-[100px] left-5 bg-white shadow-lg rounded-lg w-[300px] p-5">
           <FilterComponent handleSearchInput={handleSearchInput} handleFilterCheckBox={handleFilterCheckBox}  handleFilterClick={handleFilterClick}/>
        </aside>
        <motion.div className="m-0 grid mx-auto grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-5  lg:gap-4 xl:gap-4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
              {products.map((product)=>(
                <Card key={product?._id} image1={product?.images[0]?.url}  product={product} withDescription={true} onCardClick={()=>onCardClick(product?._id)} isWishlisted={wishlisted.includes(product._id)} setWishlisted={setWishlisted}/>
               ))}
          </motion.div>
        
      </main>
    
      <PaginationComponent numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
    </div>
  );
};

export default ShopPage;
