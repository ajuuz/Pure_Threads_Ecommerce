import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from "sonner";
import { getUserStatus } from "@/api/Admin/salesReportApi";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {

    const [blockedCount,setBlockedCount]=useState(0) 
    const [unblockedCount,setUnblockedCount]=useState(0);

    useEffect(()=>{
        const fetchUserStatus=async()=>{
            try{
                const userStatusResult=await getUserStatus();
                
                setBlockedCount(userStatusResult.userStatus.blockedUser)
                setUnblockedCount(userStatusResult.userStatus.unBlockedUser)

            }catch(error){
                toast.error(error.message)
            }
        }
        fetchUserStatus()
    },[])

  // Data for the Pie chart
  const data = {
    labels: ["Blocked Users", "Unblocked Users"],
    datasets: [
      {
        label: "User Status",
        data: [blockedCount, unblockedCount],
        backgroundColor: ["#0080FF", "#4CAF5"], // Colors for the pie segments
        borderColor: ["#0080FF", "#4CAF5"], // Border colors
        borderWidth: 1, // Border width
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position of the legend
        labels: {
          color: "#4B5563", // Tailwind gray-700
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        User Status Overview
      </h2>
      <div className="w-64 h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
