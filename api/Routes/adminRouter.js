import express from 'express';
// import UsersDB from '../Models/Schema.js';
import { adminLogin, logout } from '../Controllers/AdminController/authController.js'; 
import { upload } from '../Cloudinary/cloudinary.js';
import {  uploadImages } from '../Controllers/AdminController/imageUploadController.js';
import { addCategory, editEntireCategory, getCategories, getParticularCategory, patchCategory } from '../Controllers/AdminController/categoryController.js';
import { addProduct, editEntireProduct, getParticularProduct, getProducts, patchProduct } from '../Controllers/AdminController/productController.js';
import { editCustomers, getCustomers } from '../Controllers/AdminController/customerController.js';
import { verifyAdmin } from '../Middlewares/adminAuthMiddleware.js';
import { getAllOrders, updateOrderStatus } from '../Controllers/AdminController/orderController.js';
import { addNewCoupon } from '../Controllers/AdminController/couponController.js';
import { getAllCoupons } from '../Controllers/CommonController/couponController.js';
import { getSalesReport } from '../Controllers/AdminController/salesReportController.js';
const router = express.Router();


// LOGIN AND SIGN UP ROUTES
router.post('/login',adminLogin) //USER SIGNUP
router.post('/upload',verifyAdmin,upload.array("image",5),uploadImages)
router.post('/categories',verifyAdmin,addCategory)
router.get('/categories',verifyAdmin,getCategories)
router.get('/categories/:id',verifyAdmin,getParticularCategory)
router.put('/categories/:id',verifyAdmin,editEntireCategory)
router.patch('/categories/:categoryId',verifyAdmin,patchCategory)
router.post('/logout',logout);

// products
router.get('/products',verifyAdmin,getProducts)
router.post('/products',verifyAdmin,addProduct)
router.get('/products/:productId',verifyAdmin,getParticularProduct)
router.put('/products/:productId',verifyAdmin,editEntireProduct)
router.patch('/products/:productId',verifyAdmin,patchProduct)

// customers
router.get('/customers',verifyAdmin,getCustomers)
router.patch('/customers',verifyAdmin,editCustomers)

// orders
router.get('/orders',getAllOrders)
router.patch('/orders/:orderId',updateOrderStatus)

// coupon
router.post('/coupons',addNewCoupon)
router.get('/coupons',getAllCoupons)

// sales Report
router.get('/salesReport',getSalesReport)
export default router;