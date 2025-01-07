

import { getWallet } from '@/api/User/walletApi';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import SideBar from '@/components/UserComponent/SideBar/SideBar'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle, Activity, CreditCard, DollarSign } from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';
import PaginationComponent from '@/components/CommonComponent/PaginationComponent';
import WalletDialog from '@/components/UserComponent/Dialog/walletDialog';

const Wallet = () => {
    const [wallet, setWallet] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [transactionType,setTransactionType] = useState("all")
    const [currentPage,setCurrentPage] = useState(1);
    const [numberOfPages,setNumberOfPages] = useState(1);
    const [refresh,setRefresh] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                setIsLoading(true);
                const limit=5
                const getWalletResult = await getWallet(transactionType,limit,currentPage);
                setWallet(getWalletResult.wallet);
                setNumberOfPages(getWalletResult?.wallet?.numberOfPages)
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchWallet();
    }, [transactionType,currentPage,refresh]);

  const handleTabChange=(value)=>{
    setTransactionType(value)
    setCurrentPage(1)
  }


    return (
        <div className='md:ps-[340px] ps-5 pt-32 bg-gray-100 min-h-screen'>
            <NavBar />
            <SideBar current="wallet" />
            <div className="pe-8">
                <div className="max-w-4xl mx-auto flex flex-col">
                    <motion.header 
                        className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-10 px-8 shadow-lg rounded-2xl mb-8"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Your Wallet Dashboard</h1>
                            <motion.div
                                className="text-6xl font-light mb-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Rs. {isLoading ? '...' : wallet?.balance?.toFixed(2)}
                            </motion.div>
                            <WalletDialog 
                            dialogTriggerer={<Button size="lg" className="bg-gradient-to-r from-black via-gray-800 to-black text-white hover:from-gray-800 hover:via-black hover:to-gray-800 focus:ring-2 focus:ring-gray-600 shadow-lg rounded-lg transition-transform transform hover:scale-105 active:scale-95"><FaRupeeSign className="mr-2 h-5 w-5" />Add Funds</Button>}
                            dialogTitle="Add Money to Your Wallet" 
                            dialogDescription="Top up your wallet to shop for your favorite shirts effortlessly! Add funds now for a smoother checkout experience and exclusive offers. Stay wallet-ready and never miss out on the perfect style!"
                            setRefresh={setRefresh}
                            />
                        </div>
                    </motion.header>

                    <Tabs   onValueChange={handleTabChange} defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger  value="all">All Transactions</TabsTrigger>
                            <TabsTrigger value="Credit">Credits</TabsTrigger>
                            <TabsTrigger value="Debit">Debits</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            <TransactionList transactions={wallet?.transactions} />
                        </TabsContent>
                        <TabsContent value="Credit">
                            <TransactionList 
                                transactions={wallet?.transactions} 
                            />
                        </TabsContent>
                        <TabsContent value="Debit">
                            <TransactionList 
                                transactions={wallet?.transactions} 
                            />
                        </TabsContent>
                    </Tabs>
                </div>
                <PaginationComponent numberOfPages={numberOfPages}  currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            </div>
        </div>
    )
}

const TransactionList = ({ transactions }) => {
    return (
        <Card className="rounded-xl overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gray-50 py-6 px-6">
                <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
                    <Activity className="mr-2" /> Transaction History
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[400px] w-full">
                    {transactions?.map((transaction, index) => (
                        <TransactionItem key={transaction._id} transaction={transaction} index={index} />
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

const TransactionItem = ({ transaction, index }) => {
    const isCredit = transaction.transactionType === 'Credit';
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <motion.div
            className="py-4 px-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                        {isCredit ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.transactionDate)}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                        {isCredit ? '+' : '-'} Rs. {transaction?.amount?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction?.transactionType}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default Wallet;

