import React, { useEffect, useState } from 'react'


// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
// dropdown
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

//   apis
import { getCategories } from "@/api/User/CategoryApi";
import { FaSearch } from 'react-icons/fa';


const FilterComponent = ({handleSearchInput,handleFilterCheckBox,handleFilterClick}) => {

    const [categories,setCategories] = useState([])

    useEffect(()=>{
        const fetchCategories=async()=>{
            try{
                const categoriesResult = await getCategories();
                setCategories(categoriesResult.categories)
            }
            catch(error)
            {
                console.error(error.message)
            }
        }
        fetchCategories();
    },[])

  return (
    <>
     <div className="text-2xl font-semibold pb- text-center">Filter</div>
    <div>
        <p className='font-medium mb-1'>SEARCH</p>
        <div className=' relative'>
            <Input onChange={(e)=>handleSearchInput(e)} className="w-full" placeHolder="Search"/>
            <FaSearch onClick={()=>handleFilterClick()} className='absolute top-[9px] right-2'/>
        </div>
    </div>

    <Accordion type="single" collapsible defaultValue='item-1' className="mb-5 ">
        <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="hover:no-underline p-0">Category</AccordionTrigger>
            {categories.map((category)=>  <AccordionContent key={category._id} className="flex  items-center gap-1 p-0 font-medium text-[11px] text-gray-700"><Input name="category" id={category._id} value={category._id} onChange={(e)=>handleFilterCheckBox(e)} type="checkbox"/>{category.name.toUpperCase()}</AccordionContent>)}  
        </AccordionItem>
    </Accordion>

    <Accordion type="single" collapsible defaultValue='item-1' className="mb-5">
    <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline p-0">FIT</AccordionTrigger>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[11px] text-gray-700"><Input onChange={(e)=>handleFilterCheckBox(e)} name="fit" id="regular" value="regular" type="checkbox"/> REGULAR FIT</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[11px] text-gray-700"><Input onChange={(e)=>handleFilterCheckBox(e)} name="fit" id="slim" value="slim" type="checkbox"/> SLIM FIT</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[11px] text-gray-700"><Input onChange={(e)=>handleFilterCheckBox(e)} name="fit" id="box" value="box" type="checkbox"/> BOX FIT</AccordionContent>
    </AccordionItem>
    </Accordion>

    <Accordion type="single" defaultValue='item-1' collapsible>
    <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline p-0">SLEEVES</AccordionTrigger>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[11px] text-gray-700"><Input onChange={(e)=>handleFilterCheckBox(e)} name="sleeves"  id="full" value="full" type="checkbox"/> FULL SLEEVES</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[11px] text-gray-700"><Input onChange={(e)=>handleFilterCheckBox(e)} name="sleeves"  id="half" value="half" type="checkbox"/> HALF SLEEVES</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[11px] text-gray-700"><Input onChange={(e)=>handleFilterCheckBox(e)} name="sleeves" id="elbow"  value="elbow" type="checkbox"/> ELBOW SLEEVES</AccordionContent>
    </AccordionItem>
    </Accordion>

    <Button onClick={()=>handleFilterClick()} className=" m-0">Apply Filter</Button>
    </>
  )
}

export default FilterComponent
