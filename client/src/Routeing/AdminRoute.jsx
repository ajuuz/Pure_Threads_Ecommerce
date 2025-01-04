import React from 'react'

import { Routes, Route } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from '@/Pages/Admin/Auth/Login';
import Dashboard from '@/Pages/Admin/Dashboard/Dashboard';
import Product from '@/Pages/Admin/Product/Product';
import AddCategory from '@/Pages/Admin/Category/AddCategory';
import Category from '@/Pages/Admin/Category/Category';
import Customer from '@/Pages/Admin/Customer/Customer';
import ManageProduct from '@/Pages/Admin/Product/ManageProduct';
import AdminPrivate from './Protected_Routing/Admin/AdminPrivate';
import AdminLoginPrivate from './Protected_Routing/Admin/AdminLoginPrivate';
import Orders from '@/Pages/Admin/Orders/Orders';
import Coupon from '@/Pages/Admin/Coupon/Coupon';
import SalesReport from '@/Pages/Admin/SalesReport/SalesReport';
const AdminRoute = () => {
  return (
   <>
    <Routes>
        <Route path='/login' element={<AdminLoginPrivate><Login/></AdminLoginPrivate>}/>
        <Route path='/' element={<AdminPrivate><Dashboard/></AdminPrivate>}/>
        <Route path='/products' element={<AdminPrivate><Product/></AdminPrivate>}/>
        <Route path='/products/add' element={<AdminPrivate><ManageProduct/></AdminPrivate>}/>
        <Route path='/product/edit/:id' element={<AdminPrivate><ManageProduct/></AdminPrivate>}/>
        <Route path='/categories' element={<AdminPrivate><Category/></AdminPrivate>}/>
        <Route path='/categories/add' element={<AdminPrivate><AddCategory/></AdminPrivate>}/>
        <Route path='/category/edit/:id' element={<AdminPrivate><AddCategory/></AdminPrivate>}/>
        <Route path='/customers' element={<AdminPrivate><Customer/></AdminPrivate>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path="/coupons" element={<Coupon/>}/>
        <Route path="/salesReports" element={<SalesReport/>}/>
    </Routes>
   </>
  )
}

export default AdminRoute
