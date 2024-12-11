import React from 'react'
import { Routes, Route } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from '@/Pages/User/Auth/Login';
import Signup from '@/Pages/User/Auth/Signup';
import Otp from '@/Pages/User/Auth/Otp';
import LandingPage from '@/Pages/User/LandingPage/LandingPage';
import ShopPage from '@/Pages/User/ShopPage/ShopPage';
import ProductDetailPage from '@/Pages/User/ProductDetailPage/ProductDetailPage';
import UserPrivate from './Protected_Routing/User/UserPrivate';
import UserLoginPrivate from './Protected_Routing/User/UserLoginPrivate';
import Account from '@/Pages/User/Profile/Account/Account';
import Address from '@/Pages/User/Profile/Address/Address';
import ManageAddress from '@/Pages/User/Profile/Address/ManageAddress';
import Cart from '@/Pages/User/Cart/Cart';



const UserRoute = () => {
  return (
    <>
    <Routes>
        <Route path='/login' element={<UserLoginPrivate><Login/></UserLoginPrivate>}/>
        <Route path='/signup' element={<UserLoginPrivate><Signup/></UserLoginPrivate>}/>
        <Route path='/signup/otp' element={<Otp/>}/>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/shop' element={<ShopPage/>}/>
        <Route path='/products/:id' element={<ProductDetailPage/>}/>
        <Route path='/profile' element={<UserPrivate><Account/></UserPrivate>}/>
        <Route path='/address' element={<UserPrivate><Address/></UserPrivate>}/>
        <Route path="/address/add" element={<UserPrivate><ManageAddress/></UserPrivate>}/>
        <Route path="/address/manage/:id" element={<UserPrivate><ManageAddress/></UserPrivate>}/>
        <Route path="/cart" element={<Cart/>}/>
    </Routes>
    </>
  )
}

export default UserRoute
