import axios from "axios";
import { toast } from "sonner";



export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL , //my backend url,
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true,
})

// axiosInstance.interceptors.response.use(
//     (response) => {
//         // Handle successful responses
//         return response;
//     },
//     (error) => {
//         if (error.response?.status === 401) {
//             // Show toast error
//             toast.error("Your session has expired. Please log in again.");

//             // Redirect to login page
//             window.location.href = "/admin/login"; // Change to your login route
//         }
//         return Promise.reject(error); // Reject the error for further handling
//     }
// );