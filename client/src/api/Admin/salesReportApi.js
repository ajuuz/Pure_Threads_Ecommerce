import { axiosInstance } from "../axiosInstance";

export const getSalesReport=async(dateRange,from,to,currentPage,limit,sortCriteria)=>{
    try{
        console.log(limit)
        const response = await axiosInstance.get(`/admin/salesReport?dateRange=${dateRange}&from=${from}&to=${to}&currentPage=${currentPage}&limit=${limit}&sortCriteria=${sortCriteria}`);
        return response?.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}
export const getSalesChartData=async(criteria,year)=>{
    try{
        const response = await axiosInstance.get(`/admin/salesReport/chart?criteria=${criteria}&year=${year}`)
        return response?.data
    }
    catch(error){
        throw error?.response.data && {...error?.response.data,statusCode:error.status} || error
    }
}




export const downloadSalesReportPdf=async(dateRange,from,to,currentPage,limit,sortCriteria,totalCouponDiscount)=>{
    try{
        const response = await fetch(import.meta.env.VITE_API_URL+`/admin/salesReport/download/pdf?dateRange=${dateRange}&from=${from}&to=${to}&currentPage=${currentPage}&limit=${limit}&sortCriteria=${sortCriteria}&totalCouponDiscount=${totalCouponDiscount}`, {
            method: 'GET',
          });
          console.log(response)
    
          if (!response.ok) {
            throw new Error('Failed to download sales report');
          }

          return response
    }
    catch(error)
    {
        throw error?.response?.data
    }
}

export const downloadSalesReportExcel=async(dateRange,from,to,currentPage,limit,sortCriteria,totalCouponDiscount)=>{
    try{
        const response = await fetch(import.meta.env.VITE_API_URL+`/admin/salesReport/download/excel?dateRange=${dateRange}&from=${from}&to=${to}&currentPage=${currentPage}&limit=${limit}&sortCriteria=${sortCriteria}&totalCouponDiscount=${totalCouponDiscount}`, {
            method: 'GET',
          });
          console.log(response)
    
          if (!response.ok) {
            throw new Error('Failed to download sales report');
          }

          return response
    }
    catch(error)
    {
        throw error?.response?.data
    }
}

