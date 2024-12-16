import React, { useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

 

import Modal from '../Modal/Modal';


const TableComponent = ({headers,body,handleSwitchClick,handleCellClick}) => {
  

  
  return (
   <Table className="mt-10">
    <TableHeader className="bg-black">
      <TableRow >
        {headers.map((header,index)=><TableHead key={index} className="text-center border  text-white">{header}</TableHead>)}
      </TableRow>
    </TableHeader>
    <TableBody>
        {body.map((row,index)=>{
            return (
                <TableRow>
                    {row[1].map((cell,index)=>{
                        return(
                            cell.name==='state'
                            ?<TableCell className="text-center border">
                            <Modal id={row[0]} type="switch" handleClick={handleSwitchClick}  state={cell.value}   dialogTitle="are you sure" dialogDescription="you can list again"/>
                            </TableCell>
                            :cell.name==="image"
                            ?<TableCell className="border text-center max-w-20">
                              <div className='inline-block  border-black border-[3px] rounded-lg'>
                              <img src={cell.value} alt="category" className=" h-12 object-cover rounded-md" />
                              </div>
                              </TableCell>
                         : <TableCell onClick={()=>handleCellClick(row[0])} className={`text-center ${index===0 && "font-medium"} border ${cell.name==="categoryName" && "w-[20%]"} `}>{cell.value}</TableCell>
                        )
                    })}
                </TableRow>
            )
        })}
    </TableBody>
  </Table>
  )
}

export default TableComponent;
 