import express from 'express';
// import UsersDB from '../Models/Schema.js';

import { generateOtp,verifyLogin,verifyOtp,resendOtp, googleAuth, logout } from '../Controllers/UserController/authController.js';
import { getCategories } from '../Controllers/UserController/categoryController.js';
import { getParticularProduct, getProducts, getRelatedProduct } from '../Controllers/UserController/ProductController.js';
import { verifyUser } from '../Middlewares/userAuthMiddleware.js';
import { getUserProfile, updateUserProfile } from '../Controllers/UserController/profileController.js';
import { addAddress, deleteAddress, editAddress, getAddress, getAddresses, setDefaultAddress } from '../Controllers/UserController/addressController.js';
import { verifyUserBlocked } from '../Middlewares/userBlockMiddleware.js';
const router = express.Router();


// LOGIN AND SIGN UP ROUTES
router.post('/signup',generateOtp) //USER SIGNUP
router.post('/signup/otp',verifyOtp) //SIGN UP OTP
router.post('/login',verifyLogin) //USER LOGIN
router.post('/resendOtp',resendOtp) //USER RESEND OTP
router.post('/googleLogin',googleAuth)
router.post('/logout',logout)
// categories
router.get('/categories',getCategories)

// products
router.get('/products',getProducts)
router.get('/products/:id',getParticularProduct)
router.get('/products/category/:catId',getRelatedProduct)

router.get('/',verifyUser,verifyUserBlocked,getUserProfile)
router.patch('/',verifyUser,verifyUserBlocked,updateUserProfile)

// address
router.get('/address',verifyUser,verifyUserBlocked,getAddresses)
router.post('/address',verifyUser,verifyUserBlocked,addAddress)
router.get('/address/:id',verifyUser,verifyUserBlocked,getAddress)
router.put('/address/:id',verifyUser,verifyUserBlocked,editAddress)
router.delete('/address/:id',verifyUser,verifyUserBlocked,deleteAddress)
router.patch('/address/:id',verifyUser,verifyUserBlocked,setDefaultAddress)

export default router;