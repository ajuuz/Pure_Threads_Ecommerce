import PieChart from '@/components/AdminComponent/PieChart/PieChart'
import SalesChart from '@/components/AdminComponent/SalesChart/SalesChart'
import SideBar from '@/components/AdminComponent/SideBar'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="AdminProduct relative ps-5 md:ps-[300px] pe-5 pt-16">
      <SideBar />
      <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
             <SalesChart/>
             <PieChart/>
      </div>
    </div>
  )
}

export default Dashboard
