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
import CheckOut from '@/Pages/User/CheckOut/CheckOut';
import Orders from '@/Pages/User/Profile/Orders/Orders';
import OrderDetail from '@/Pages/User/Profile/Orders/OrderDetail';
import VerifyEmail from '@/Pages/User/Auth/ForgotPassword/VerifyEmail';
import ChangePassword from '@/Pages/User/Auth/ForgotPassword/ChangePassword';
import Wishlist from '@/Pages/User/Wishlist/Wishlist';
import Coupon from '@/Pages/User/Profile/Coupon/Coupon';
import Wallet from '@/Pages/User/Profile/Wallet/Wallet';
import Refferal from '@/Pages/User/Profile/Refferal/Refferal';
const UserRoute = () => {
  return (
    <>
    <Routes>
        <Route path='/login' element={<UserLoginPrivate><Login/></UserLoginPrivate>}/>
        <Route path='/signup' element={<UserLoginPrivate><Signup/></UserLoginPrivate>}/>
        <Route path='/otp' element={<Otp/>}/>
        <Route path="/forgot/verifyEmail" element={<VerifyEmail/>}/>
        <Route path="/forgot/changePassword" element={<ChangePassword/>}/>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/shop' element={<ShopPage/>}/>
        <Route path='/products/:productId' element={<ProductDetailPage/>}/>
        <Route path='/profile' element={<UserPrivate><Account/></UserPrivate>}/>
        <Route path='/address' element={<UserPrivate><Address/></UserPrivate>}/>
        <Route path="/address/add" element={<UserPrivate><ManageAddress/></UserPrivate>}/>
        <Route path="/address/manage/:id" element={<UserPrivate><ManageAddress/></UserPrivate>}/>
        <Route path="/cart" element={<UserPrivate><Cart/></UserPrivate>}/>
        <Route path="/checkout" element={<UserPrivate><CheckOut/></UserPrivate>}/>
        <Route path="/orders" element={<UserPrivate><Orders/></UserPrivate>}/>
        <Route path="/orders/:orderId" element={<UserPrivate><OrderDetail/></UserPrivate>}/>
        <Route path="/wishlist" element={<UserPrivate><Wishlist/></UserPrivate>}/>
        <Route path="/coupons" element={<UserPrivate><Coupon/></UserPrivate>}/>
        <Route path="/wallet" element={<UserPrivate><Wallet/></UserPrivate>}/>
        <Route path="/refferal" element={<UserPrivate><Refferal/></UserPrivate>}/>
    </Routes>
    </>
  )
}

export default UserRoute
