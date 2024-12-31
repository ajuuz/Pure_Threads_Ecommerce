import { editCustomers, getCustomers } from '@/api/Admin/customerApi';
import Modal from '@/components/AdminComponent/Modal/Modal';
import SideBar from '@/components/AdminComponent/SideBar'
import TableComponent from '@/components/AdminComponent/Table/TableCompnent';
import { Switch } from '@/components/ui/switch';
import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'


// implementing toast for messages
import { toast } from "sonner"

const Customer = () => {

    const [refresh,setRefresh] = useState(false);
    const [customers,setCustomers] = useState([]);

    useEffect(()=>{
        const fetchCustomers = async ()=>{
            try{
                const response = await getCustomers();
                const customersDetails = response.customers;
                const transformedCustomers = customersDetails.map((customer,index)=>(
                    [customer._id,[{name:"sno",value:index+1},
                        {name:"name",value:customer.name},
                        {name:"phone",value:customer.phone},
                        {name:"email",value:customer.email},
                        {name:"state",value:<Modal handleClick={()=>handleSwitchClick(customer._id)} dialogTitle="are you sure" dialogDescription="you can list again" alertDialogTriggerrer={<Switch checked={customer?.isActive} />}/>}]]
                ))
                setCustomers(transformedCustomers)
            }
            catch(error)
            {
                console.error(error)
                toast.error(error.message)
            }
        }
        fetchCustomers();
    },[refresh])



    const handleSwitchClick=async(id)=>{
        try{
            const response = await editCustomers(id);
            console.log(response);
            toast.success(response.message,{autoClose: 1000})
            setRefresh(!refresh)
        }
        catch(error)
        {
            console.log(error.message)
            toast.error(error.message,{autoClose: 1000})
        }
    }

const headers=["SNO","Customer Name","Phone","Email","State"]
  return (
    <div className="AdminProduct relative h-[200vh] ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      <div>
        {/*  first div */}
        <div className=" flex items-center justify-around gap-7">
          <h1 className="text-xl font-bold">Customers</h1>
          <div className="flex-1 flex items-center">
            <div className="text-white bg-black p-2 rounded-s-md">search</div>
            <input className="border w-[100%] py-2" type="text" />
            <div className="text-white bg-black p-3 rounded-e-md">
              <CiSearch />
            </div>
          </div>
          <div className="bg-black text-white px-4 py-2 rounded-lg">
            <span>Filter</span>
          </div>
        </div>

        <TableComponent headers={headers} body={customers} handleSwitchClick={handleSwitchClick}/>
      </div>
    </div>
  )
}

export default Customer
