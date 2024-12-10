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


const FilterComponent = () => {

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
     <div className="text-2xl font-semibold pb-3 text-center">Filter</div>
    <div>
        <p className='font-medium mb-1'>SEARCH</p>
        <Input className="w-full" placeHolder="Search"/>
    </div>

    <Accordion type="single" collapsible defaultValue='item-1' className="mb-5">
        <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="hover:no-underline p-0 text-lg">FIT</AccordionTrigger>
            {categories.map((category)=>  <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[12px] text-gray-700"><Input type="checkbox"/>{category.name.toUpperCase()}</AccordionContent>)}  
        </AccordionItem>
    </Accordion>

    <Accordion type="single" collapsible defaultValue='item-1' className="mb-5">
    <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline p-0 text-lg">FIT</AccordionTrigger>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[12px] text-gray-700"><Input type="checkbox"/> REGULAR FIT</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[12px] text-gray-700"><Input type="checkbox"/> SLIM FIT</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[12px] text-gray-700"><Input type="checkbox"/> BOX FIT</AccordionContent>
    </AccordionItem>
    </Accordion>

    <Accordion type="single" defaultValue='item-1' collapsible>
    <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline p-0 text-lg">SLEEVES</AccordionTrigger>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[12px] text-gray-700"><Input type="checkbox"/> FULL SLEEVES</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[12px] text-gray-700"><Input type="checkbox"/> HALF SLEEVES</AccordionContent>
            <AccordionContent className="flex items-center gap-1 p-0 font-medium text-[12px] text-gray-700"><Input type="checkbox"/> THIRD</AccordionContent>
    </AccordionItem>
    </Accordion>

    <Button className=" m-0">Reset Filter</Button>
    </>
  )
}

export default FilterComponent
