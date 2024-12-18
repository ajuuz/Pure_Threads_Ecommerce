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
  const [refresh,setRefresh] = useState(false)


  // router dom
   const navigate = useNavigate()

   useEffect(()=>{
    const fetchProducts=async()=>{
        try{
          const sortCriteria=JSON.stringify(selectedValue.sort)
          const limit=10
          const category = filterCheckBoxes.category;
          const fit = filterCheckBoxes.fit;
          const sleeves = filterCheckBoxes.sleeves
          const searchQuery = searchInput;
          const productsResult = await getProducts(sortCriteria,limit,currentPage,category,fit,sleeves,searchQuery)
          console.log(productsResult.products)
          setProducts(productsResult.products)
          setNumberOfPages(productsResult.numberOfPages)
        }
        catch(error)
        {
            console.log(error)
        } 
    }
    fetchProducts();
   },[currentPage,refresh,selectedValue])

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
 console.log(filterCheckBoxes)
}

const handleFilterClick=()=>{
  setCurrentPage(1)
  setRefresh(!refresh)
}

const handleSort=(value)=>{
  setSelectedValue(value)
}

  return (
    <div className=" relative pt-[120px] pb-5 lg:ps-[350px]">
      <NavBar />
      <div className="flex justify-end py-1 pe-28">
      <Select name="updateStatus" onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`sort by : ${selectedValue.label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={{ label: "newest", sort: { createdAt: -1 } }}>Newest</SelectItem>
        <SelectItem value={{ label: "Price: Low to High", sort: { regularPrice: 1 } }}>Price: Low to High</SelectItem>
        <SelectItem value={{ label: "Price: High to Low", sort: { regularPrice: -1 } }}>Price: High to Low</SelectItem>
        <SelectItem value={{ label: "Aa-Zz", sort: { name: 1 } }}>Aa-Zz</SelectItem>
        <SelectItem value={{ label: "Zz-Aa", sort: { name: -1 } }}>Zz-Aa</SelectItem>
      </SelectContent>
    </Select>
      </div>
      <main className="flex">
        <aside className="border-2 hidden  lg:flex flex-col gap-1 fixed top-[100px] left-5 bg-white shadow-lg rounded-lg w-[300px] p-5">
           <FilterComponent handleSearchInput={handleSearchInput} handleFilterCheckBox={handleFilterCheckBox}  handleFilterClick={handleFilterClick}/>
        </aside>
        <motion.div className="grid mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-5 md:gap-5 lg:gap-4 xl:gap-4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
              {products.map((product)=>(
                <Card key={product?._id} image1={product?.images[0]?.url}  product={product} withDescription={true} onCardClick={()=>onCardClick(product?._id)}/>
               ))}
          </motion.div>
        
      </main>
    
      <PaginationComponent numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
    </div>
  );
};

export default ShopPage;
