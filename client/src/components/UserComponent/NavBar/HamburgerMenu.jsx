import React, { useEffect, useState } from 'react'


import { getCategories } from '@/api/User/CategoryApi';

// dropdown
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import { motion } from 'framer-motion';

//   icons
  import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const HamburgerMenu = ({setIsHamburger}) => {

    // useState
    const [categories,setCategories] = useState([]);
    const navigate = useNavigate()
    // useEffects
    useEffect(()=>{
       const fetchCategories = async()=>{
        try{
            const categoriesResult=await getCategories();
            const categories=categoriesResult.categories;
            setCategories(categories);
        }
        catch(error)
        {
            console.log(error.message)
        }
       }
       fetchCategories();
    },[])


    const handleCategoryClick=(id)=>{
        console.log(id)
    }

  return (
    <motion.div 
    className='hamburgerMenu border-4  bg-white left-2 top-8 absolute shadow-xl font-medium flex flex-col  px-10 py-5 min-h-[94vh] rounded-xl' 
    initial={{ x: "-40vw" }}
    animate={{ x: 0 }}
    exit={{ x: "-100vw" }}
    transition={{ type: "spring", stiffness: 50 }}
    >
      <div className='font-mono font-extrabold text-2xl mb-6 flex items-center me-5 relative right-8 gap-2'><IoIosArrowBack onClick={()=>setIsHamburger(false)} className='cursor-pointer'/>PURE THREADS</div>
      <div className='pb-6 text-sm'>CONTACT</div>
      <div className='pb-6 text-sm'>ABOUT</div>
      <div onClick={()=>navigate('/shop')} className='pb-6 text-sm'>ALL PRODUCTS</div>
      <div>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="hover:no-underline">CATEGORIES</AccordionTrigger>
                    {categories.map((category)=><AccordionContent>{category.name}</AccordionContent>)}
            </AccordionItem>
        </Accordion>
     </div>

     <div>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="hover:no-underline">FIT</AccordionTrigger>
                    <AccordionContent>REGULAR FIT</AccordionContent>
                    <AccordionContent>SLIM FIT</AccordionContent>
                    <AccordionContent>BOX FIT</AccordionContent>
            </AccordionItem>
        </Accordion>
     </div>

     <div>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="hover:no-underline">SLEEVES</AccordionTrigger>
                    <AccordionContent>FULL SLEEVES</AccordionContent>
                    <AccordionContent>HALF SLEEVES</AccordionContent>
                    <AccordionContent>THIRD SLEEVES</AccordionContent>
            </AccordionItem>
        </Accordion>
     </div>
     
    </motion.div>
  )
}

export default HamburgerMenu
