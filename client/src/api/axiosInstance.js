import axios from "axios";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { store } from "@/Redux/store";
import { UserLogout } from "@/Redux/userSlice";


export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL , //my backend url,
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true,
})


axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        if (error.response?.status === 403) {
            // Show toast error
            store.dispatch(UserLogout())
            toast.warning("you are blocked . please contact admin");
        }
        return Promise.reject(error); // Reject the error for further handling
    }
);


