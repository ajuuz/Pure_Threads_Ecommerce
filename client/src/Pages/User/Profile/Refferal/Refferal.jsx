import { applyRefferal, getRefferalCode } from '@/api/User/refferalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import { Copy } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Refferal = () => {

    const [refferalCode,setRefferalCode]=useState("");
    const [refferalInput,setRefferalInput]=useState("")
    const [isRefferedUser,setIsRefferedUser]=useState(false)
    useEffect(()=>{
            const fetchUserRefferalCode = async()=>{
                try{
                    const getRefferalCodeResult = await getRefferalCode();
                    console.log(getRefferalCodeResult.refferalCode)
                    setRefferalCode(getRefferalCodeResult.refferalCode)
                    setIsRefferedUser(getRefferalCodeResult.isRefferedUser);
                }
                catch(error)
                {
                    console.log(error.message)
                }
            }
            fetchUserRefferalCode();
        },[])

        const handleApplyRefferal=async()=>{
            try{
                
                const applyRefferalResult=await applyRefferal(refferalInput,refferalCode);
                toast.success(applyRefferalResult.message);
                setIsRefferedUser(true)
            }catch(error){
                toast.error(error.message)
            }
        }

        const handleCopyCode=()=>{
            navigator.clipboard.writeText(refferalCode)
            toast.info("Refferal Code Copied")
        }

        const handleRefferalChange=(e)=>setRefferalInput(e.target.value)

  return (
    <div className='md:ps-[340px] ps-5 pt-32 bg-gray-100 min-h-screen'>
    <NavBar />
    <SideBar current="refferal" />
        <div className="pe-8">
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Your Referral Code</h3>
                <div className="bg-gray-100 flex flex-col gap-5 p-3 rounded-md text-center">
                    <p>This is your referral code! Earn ₹200 for every friend you refer.</p>
                  <code className="flex justify-center items-center text-2xl font-mono border-4 border-dashed rounded-lg h-16 text-gray-600 relative">
                    <Copy onClick={handleCopyCode} className='cursor-pointer absolute top-2 right-2'/>
                    {refferalCode}
                    </code>
                </div>
              </div>
              {
                !isRefferedUser &&
              <div>
              <h3 className="text-center text-lg font-semibold mb-2">Unlock Your Reward</h3>
                <p className='text-center'>Enter your friend's Refferal Code to get reward of Rs.200 in to your wallet</p>
                <Input onChange={handleRefferalChange} className="border w-full my-2"/>
                <Button onClick={handleApplyRefferal}>SUBMIT</Button>
              </div>
            }
        </div>
        </div>
    </div>
  )
}

export default Refferal
