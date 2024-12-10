import React, { useEffect, useState } from 'react'

// import components
import SideBar from '@/components/AdminComponent/SideBar'
import { CiSearch } from 'react-icons/ci'
import TableComponent from '@/components/AdminComponent/Table/TableCompnent'
import { editCategory, getCategories } from '@/api/Admin/categoryApi'
import { useNavigate } from 'react-router-dom'


// implementing toast for messages
import { toast } from "sonner"


const Category = () => {
    const [refresh,setRefresh] = useState(true);
    const [categories,setCategories] = useState([])

    const navigate= useNavigate()

    useEffect(()=>{
            const fetchCategory = async()=>{
            const response = await getCategories();
            const categoriesDetails=response.data;
            const transformedCategoriesDetails = categoriesDetails.map((category,index)=>{
               return [category._id,[{name:"sno",value:index+1},{name:"image",value:category.images[0]?.url},{name:"categoryName",value:category.name},{name:"description",value:category.description},{name:"state",value:category.isActive},{name:"offer",value:category.offer}]]
            })
            setCategories(transformedCategoriesDetails);
            }
            fetchCategory();
        },[refresh])

    const handleCategoryClick=(id)=>{
        navigate(`/admin/category/edit/${id}`)
    }

    const handleSwitchClick=async(id)=>{
        console.log(id)
        try{
            const response = await editCategory(id);
            console.log(response)
            toast.success(response.message,{autoClose: 1000});
            setRefresh(!refresh)
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    const headers=["SN0","image","Category Name","description","State","Offer"]
  return (
    <div className="AdminAddCategory relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      <div>
        {/*  first div */}
        <div className="product-first-div flex items-center justify-around gap-7">
          <h1 className="text-xl font-bold">Categories</h1>
          <div className="flex-1 flex items-center">
            <div className="text-white bg-black p-2 rounded-s-md">search</div>
            <input className="border w-[100%] py-2" type="text" />
            <div className="text-white bg-black p-3 rounded-e-md">
              <CiSearch />
            </div>
          </div>
          <div onClick={()=>navigate('/admin/categories/add')} className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg">
            <span>Add New Category</span>
          </div>
        </div>
        {/* product page table div */}
        <TableComponent headers={headers} body={categories} handleSwitchClick={handleSwitchClick}  handleCellClick={handleCategoryClick}/>
       
      </div>
    </div>
  )
}

export default Category
