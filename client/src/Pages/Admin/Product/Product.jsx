import React, { useEffect, useState } from "react";
import './Product.css'

import SideBar from "@/components/AdminComponent/SideBar";
import { CiSearch } from "react-icons/ci";

import TableComponent from "@/components/AdminComponent/Table/TableCompnent";
import Modal from "@/components/AdminComponent/Modal/Modal";
import { Switch } from "@/components/ui/switch";

// apis
import { changeProductState, getProducts } from "@/api/Admin/productApi";
import { useNavigate } from "react-router-dom";


// implementing toast for messages
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import OfferDialogComponent from "@/components/AdminComponent/Dialog/OfferDialogComponent";
import PaginationComponent from "@/components/CommonComponent/PaginationComponent";

const Product = () => {

  const [products,setProducts]= useState([]);
  const [currentPage,setCurrentPage]= useState(1)
  const [numberOfPages,setNumberOfPages]=useState(1)

  const [refresh,setRefresh] = useState(false)

  const [searchQuery,setSearchQuery] = useState("")
    const navigate = useNavigate()

    const fetchProducts=async ()=>{

      const sort={createdAt:-1}
      const limit=7
      const sortCriteria=JSON.stringify(sort)
      const category=[],fit=[],sleeves=[],target="admin";

      const productsResult = await getProducts(sortCriteria,limit,currentPage,category,fit,sleeves,searchQuery,target)
      const products = productsResult?.products
      
      const transformedProducts=products.map((product,index)=>{
        let sumOfStock = product.sizes.reduce((acc,curr)=>acc+=curr.stock,0)
       return [product._id,[{name:"sno",value:index+1},
                        {name:"image",value:<div className='inline-block  border-black border-[3px] rounded-lg'>
                                              <img src={product?.images[0].url} alt="category" className=" h-12 object-cover rounded-md" />
                                            </div>},
                        {name:"name",value:product.name},
                        {name:"category",value:product?.categoryDetails?.name},
                        {name:"price",value:product?.salesPrice},
                        {name:"stock",value:sumOfStock},
                        {name:"state",value:<Modal handleClick={()=>handleSwitchClick(product?._id)}   dialogTitle="are you sure" dialogDescription="you can list again" alertDialogTriggerrer={<Switch checked={product?.isActive} />}/>},
                        {name:"offer",value:<><p className="font-bold">{product?.offer?.offerValue +" "+ product?.offer?.offerType} off</p><OfferDialogComponent content={product}  offerScope="Product" dialogTriggerer={<Button className="m-0">update Offer</Button>} /></>}
                          ]]
    })
      setProducts(transformedProducts)
      setNumberOfPages(productsResult?.numberOfPages);
    }

    useEffect(()=>{
      fetchProducts();
    },[refresh,currentPage])

    const handleSwitchClick =async (id)=>{
      try{
          const response = await changeProductState(id);
          toast.success(response.message);
          setRefresh(!refresh)
      }
      catch(error)
      {
          toast.error(error.message)
      }
    }

    const handleProductClick=(id)=>{
      navigate(`/admin/product/edit/${id}`)
    }

    const handleSearchInputChange=(e)=>{
      setSearchQuery(e.target.value)
      if(e.target.value==="") fetchProducts()
    }

    const handleSearchClick=()=>{
      fetchProducts()
      setCurrentPage(1)
    }

    const headers=["SN0","image","Product Name","category","price","stock","State","Offer"]

  return (
    <div className="AdminProduct relative  ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      <div>
        {/*  first div */}
        <div className="product-first-div flex items-center justify-around gap-7">
          <h1 className="text-xl font-bold">Products</h1>
          <div className="flex-1 flex items-center">
            <div className="text-white bg-black p-2 rounded-s-md">search</div>
            <input 
            onChange={handleSearchInputChange}
            className="border w-[100%] py-2 ps-2 placeholder:text-sm" 
            placeholder="search any product..."
            type="text"
            />
            <div onClick={handleSearchClick} className="text-white bg-black p-3 rounded-e-md">
              <CiSearch/>
            </div>
          </div>
          <div onClick={()=>navigate('/admin/products/add')} className="bg-black text-white px-4 py-2 rounded-lg">
            <span>Add New Product</span>
          </div>
        </div>
        {/* product page table div */}
        <TableComponent headers={headers} body={products} handleSwitchClick={handleSwitchClick}  handleCellClick={handleProductClick} />
        <PaginationComponent numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  );
};

export default Product;
