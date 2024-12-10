import React from "react";

import SideBar from "@/components/AdminComponent/SideBar";
import { FiUsers } from "react-icons/fi";
const Dashboard = () => {
  return (
    <div className="AdminDashboard relative h-[200vh] ps-[300px] pe-5 pt-16">
      <SideBar />
      <div className="Dashboard-first-div shadow-lg flex px-5 py-8 justify-between rounded-2xl">
        <div className="flex flex-1 border-0 border-r-2 gap-3 pe-6 items-center justify-center">
          <div className="">
            <div className="rounded-[40px] border border-black px-5 py-5 "><FiUsers /></div>
          </div>
          <div>
            <p className="text-gray-700">Total Customers</p>
            <p className="font-bold text-xl">423</p>
            <p className="text-sm font-semibold">16% this month</p>
          </div>
        </div>
        <div className="flex flex-1 border-0 border-r-2 gap-3 pe-6 items-center justify-center">
          <div className="">
            <div className="rounded-[40px] border border-black px-5 py-5 "><FiUsers /></div>
          </div>
          <div>
            <p className="text-gray-700">Total Customers</p>
            <p className="font-bold text-xl">423</p>
            <p className="text-sm font-semibold">16% this month</p>
          </div>
        </div>
        <div className="flex flex-1 border-0 border-r-2 gap-3 pe-6 items-center justify-center">
          <div className="">
            <div className="rounded-[40px] border border-black px-5 py-5 "><FiUsers /></div>
          </div>
          <div>
            <p className="text-gray-700">Total Customers</p>
            <p className="font-bold text-xl">423</p>
            <p className="text-sm font-semibold">16% this month</p>
          </div>
        </div>
        <div className="flex flex-1 border-0  gap-3 pe-6 items-center justify-center">
          <div className="">
            <div className="rounded-[40px] border border-black px-5 py-5 "><FiUsers /></div>
          </div>
          <div>
            <p className="text-gray-700">Total Customers</p>
            <p className="font-bold text-xl">423</p>
            <p className="text-sm font-semibold">16% this month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
