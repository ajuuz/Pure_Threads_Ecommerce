import express from 'express';
// import UsersDB from '../Models/Schema.js';

import { generateOtp,verifyLogin,verifyOtp,resendOtp, googleAuth, logout } from '../Controllers/UserController/authController.js';
import { getCategories } from '../Controllers/UserController/categoryController.js';
import { getParticularProduct, getProducts, getRelatedProduct } from '../Controllers/UserController/ProductController.js';
import { verifyUser } from '../Middlewares/userAuthMiddleware.js';
import { getUserProfile, updateUserProfile } from '../Controllers/UserController/profileController.js';
import { addAddress, deleteAddress, editAddress, getAddress, getAddresses, setDefaultAddress } from '../Controllers/UserController/addressController.js';
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
router.get('/products/:id',verifyUser,getParticularProduct)
router.get('/products/category/:catId',getRelatedProduct)

router.get('/',getUserProfile)
router.patch('/',updateUserProfile)

// address
router.get('/address',getAddresses)
router.post('/address',addAddress)
router.get('/address/:id',getAddress)
router.put('/address/:id',editAddress)
router.delete('/address/:id',deleteAddress)
router.patch('/address/:id',setDefaultAddress)

export default router;