import express from 'express';
// import UsersDB from '../Models/Schema.js';
import { adminLogin, logout } from '../Controllers/AdminController/authController.js'; 
import { upload } from '../Cloudinary/cloudinary.js';
import {  uploadImages } from '../Controllers/AdminController/imageUploadController.js';
import { addCategory, editEntireCategory, getCategories, getParticularCategory, patchCategory } from '../Controllers/AdminController/categoryController.js';
import { addProduct, editEntireProduct, getParticularProduct, patchProduct } from '../Controllers/AdminController/productController.js';
import { getProducts } from '../Controllers/CommonController/productController.js';
import { editCustomers, getCustomers } from '../Controllers/AdminController/customerController.js';
import { verifyAdmin } from '../Middlewares/adminAuthMiddleware.js';
import { updateOrderStatus } from '../Controllers/AdminController/orderController.js';
import { addNewCoupon, editCoupon } from '../Controllers/AdminController/couponController.js';
import { getAllCoupons } from '../Controllers/CommonController/couponController.js';
import { downloadSalesReportExcel, downloadSalesResportPdf, getSalesChartData, getSalesReport } from '../Controllers/AdminController/salesReportController.js';
import { getAllOrders } from '../Controllers/CommonController/orderController.js';
import { getUserStatus } from '../Controllers/AdminController/dashboardController.js';
const router = express.Router();


// LOGIN AND SIGN UP ROUTES
router.post('/login',adminLogin) //USER SIGNUP
router.post('/upload',upload.array("image",5),uploadImages)
// router.post('/upload',verifyAdmin,upload.array("image",5),uploadImages)
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
router.get('/orders',verifyAdmin,getAllOrders)
router.patch('/orders/:orderId',verifyAdmin,updateOrderStatus)

// coupon
router.get('/coupons',verifyAdmin,getAllCoupons)
router.post('/coupons',verifyAdmin,addNewCoupon)
router.put('/coupons',verifyAdmin,editCoupon)

// sales Report
router.get('/salesReport',verifyAdmin,getSalesReport)
router.get('/salesReport/download/pdf',verifyAdmin,downloadSalesResportPdf)
router.get('/salesReport/download/excel',verifyAdmin,downloadSalesReportExcel)
router.get('/salesReport/chart',verifyAdmin,getSalesChartData)

//dashboard
router.get('/dashboard',getUserStatus)

export default router;