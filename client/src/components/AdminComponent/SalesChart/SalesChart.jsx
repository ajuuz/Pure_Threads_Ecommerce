import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Button } from "@/components/ui/button";
import { getSalesChartData } from "@/api/Admin/salesReportApi";
import { toast } from "sonner";
import SalesChartDialog from "../Dialog/SalesChartDialog";

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SalesChart = () => {

    const [criteria,setCriteria]= useState("year");
    const [data,setData] = useState([])
    const [year,setYear] = useState("")

    useEffect(()=>{
        const fetchSalesChartData=async()=>{
            try{
                const getSalesChartDataResult=await getSalesChartData(criteria,year);
                setData(getSalesChartDataResult.chartData.sort((a,b)=>a.label-b.label));
            }
            catch(error)
            {
                toast.error(error.message)
            }
        }
        fetchSalesChartData()
    },[criteria,year])

   
  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.label), // Labels for X-axis (e.g., Years, Months, Weeks)
    datasets: [
      {
        label: "Total Sales Rs",
        data: data.map(item => item.totalSaleAmount), // Corresponding sales values
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Sales Data",
        font: {
          size: 18,
        },
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time Period",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales Amount ($)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Sales Chart</h2>
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
      <div className=" flex justify-center gap-3">
        <Button onClick={()=>setCriteria("year")}>Year</Button>
        <SalesChartDialog  setYear={setYear} criteria="month" setCriteria={setCriteria}  dialogTriggerer={<Button>Month</Button>} />
        <SalesChartDialog  setYear={setYear} criteria="week" setCriteria={setCriteria} dialogTriggerer={<Button>Week</Button>}/>
      </div>
    </div>
  );
};

export default SalesChart;
