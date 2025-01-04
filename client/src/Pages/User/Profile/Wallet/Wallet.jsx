import { getWallet } from '@/api/User/walletApi';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const Wallet = () => {
    const [wallet,setWallet] = useState({});

    useEffect(()=>{
        const fetchWallet=async()=>{
            try{
                const getWalletResult = await getWallet();
                setWallet(getWalletResult.wallet);
                console.log(getWalletResult.wallet)
            }
            catch(error)
            {
                toast.error(error.message)
            }
        }
        fetchWallet();
    },[])
  return (
    <div className='md:ps-[340px] ps-5  pt-32'>
    <NavBar/>
    <SideBar current="wallet"/>
    <div className=" pe-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wallet</h1>
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <div className='flex items-center justify-between border-4 rounded border-dashed border-slate-200 bg-slate-100 p-5 h-[200px]'>
            <div className='flex items-baseline gap-3 text-6xl font-semibold'>
                <span>Balance:</span>
                <span className=''>{wallet?.balance}</span>
            </div>
            <div>
                <Button>Add Wallet Money</Button>
            </div>
        </div>

        <div className='border'>
            {wallet?.transactions?.map((transaction)=>(
                <div className='p-3 shadow-md font-semibold'>
                    <p>Order ID : {transaction?.orderId}</p>
                    <p>Transaction Date : {transaction?.transactionDate}</p>
                    <p>Transaction Status : {transaction?.transactionStatus}</p>
                    <p>Transaction Type : {transaction?.transactionType}</p>
                    <p>Transaction Amount : {transaction?.amount}</p>
                </div>
            ))}
        </div>


      </div>
    </div>
    </div>
  )
}

export default Wallet
