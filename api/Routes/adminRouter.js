import express from 'express';
// import UsersDB from '../Models/Schema.js';
import { adminLogin, logout } from '../Controllers/AdminController/authController.js'; 
import { upload } from '../Cloudinary/cloudinary.js';
import {  uploadImages } from '../Controllers/AdminController/imageUploadController.js';
import { addCategory, editEntireCategory, getCategories, getParticularCategory, patchCategory } from '../Controllers/AdminController/categoryController.js';
import { addProduct, editEntireProduct, getParticularProduct, getProducts, patchProduct } from '../Controllers/AdminController/productController.js';
import { editCustomers, getCustomers } from '../Controllers/AdminController/customerController.js';
import { verifyAdmin } from '../Middlewares/adminAuthMiddleware.js';
const router = express.Router();


// LOGIN AND SIGN UP ROUTES
router.post('/login',adminLogin) //USER SIGNUP
router.post('/upload',verifyAdmin,upload.array("image",5),uploadImages)
router.post('/categories',verifyAdmin,addCategory)
router.get('/categories',verifyAdmin,getCategories)
router.get('/categories/:id',verifyAdmin,getParticularCategory)
router.put('/categories/:id',verifyAdmin,editEntireCategory)
router.patch('/categories',verifyAdmin,patchCategory)
router.post('/logout',logout);

// products
router.get('/products',verifyAdmin,getProducts)
router.post('/products',verifyAdmin,addProduct)
router.get('/products/:id',verifyAdmin,getParticularProduct)
router.put('/products/:id',verifyAdmin,editEntireProduct)
router.patch('/products/:id',verifyAdmin,patchProduct)

// customers
router.get('/customers',verifyAdmin,getCustomers)
router.patch('/customers',verifyAdmin,editCustomers)



export default router;