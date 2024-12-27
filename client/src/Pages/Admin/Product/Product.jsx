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

const Product = () => {

    const [refresh,setRefresh] = useState(false)
    const [products,setProducts]= useState([]);
    const navigate = useNavigate()

    useEffect(()=>{
      const fetchProducts=async ()=>{
        const response = await getProducts()
        const productDetails = response.data;
        console.log(productDetails)
        const transformedProducts=productDetails.map((product,index)=>{
          let sumOfStock = product.sizes.reduce((acc,curr)=>acc+=curr.stock,0)
         return [product._id,[{name:"sno",value:index+1},
                          {name:"image",value:<div className='inline-block  border-black border-[3px] rounded-lg'>
                                                <img src={product?.images[0].url} alt="category" className=" h-12 object-cover rounded-md" />
                                              </div>},
                          {name:"name",value:product.name},
                          {name:"category",value:product?.category?.name},
                          {name:"price",value:product?.salesPrice},
                          {name:"stock",value:sumOfStock},
                          {name:"state",value:<Modal handleClick={()=>handleSwitchClick(product?._id)}   dialogTitle="are you sure" dialogDescription="you can list again" alertDialogTriggerrer={<Switch checked={product?.isActive} />}/>},
                          {name:"offer",value:<><p className="font-bold">{product?.offer?.offerValue +" "+ product?.offer?.offerType} off</p><OfferDialogComponent content={product}  offerScope="Product" dialogTriggerer={<Button className="m-0">update Offer</Button>} /></>}
                            ]]
      })
        setProducts(transformedProducts)
      }
      fetchProducts();
    },[refresh])

    const handleSwitchClick =async (id)=>{
      try{
          const response = await changeProductState(id);
          console.log(response)
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
            <input className="border w-[100%] py-2" type="text" />
            <div className="text-white bg-black p-3 rounded-e-md">
              <CiSearch />
            </div>
          </div>
          <div onClick={()=>navigate('/admin/products/add')} className="bg-black text-white px-4 py-2 rounded-lg">
            <span>Add New Product</span>
          </div>
        </div>
        {/* product page table div */}
        <TableComponent headers={headers} body={products} handleSwitchClick={handleSwitchClick}  handleCellClick={handleProductClick} />
       
      </div>
    </div>
  );
};

export default Product;
