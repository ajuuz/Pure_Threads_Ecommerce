import React, { useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

 



const TableComponent = ({headers,body,handleCellClick}) => {
  

  
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
                            <TableCell onClick={()=>(cell.name==="name" || cell.name==="image") && handleCellClick(row[0])}  className={`text-center ${index===0 && "font-medium"} border ${(cell.name==="categoryName"|| cell.name==="offer") && "w-[10%]"} ${(cell.name==="name" || cell.name==="image") && "cursor-pointer"}`}>{cell.value}</TableCell>
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
 