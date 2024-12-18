import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
  const PaginationComponent=({numberOfPages,currentPage,setCurrentPage})=> {

    const pagePreviousButton=()=>{
      if(currentPage<=1) return
      setCurrentPage((prev)=>prev-1)
    }

    const pageNextButton=()=>{
      if(currentPage>=numberOfPages) return 
      setCurrentPage((prev)=>prev+1)
    }

    return (
      <Pagination>
        <PaginationContent  className="cursor-pointer">
          <PaginationItem >
            <PaginationPrevious onClick={pagePreviousButton} className="mb-5"/>
          </PaginationItem>

          {Array.from({ length:numberOfPages },(_,index)=>(
          <PaginationItem>
          <PaginationLink isActive={currentPage} onClick={()=>setCurrentPage(index+1)} className={`${currentPage===index+1 && "bg-black text-white hover:bg-gray-800 hover:text-white"} `} >{index+1}</PaginationLink>
        </PaginationItem>)
          )}
         
          <PaginationItem>
            <PaginationNext onClick={pageNextButton} className="mb-5"/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }
  
export default PaginationComponent;