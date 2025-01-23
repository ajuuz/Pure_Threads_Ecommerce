import express from 'express';
// import UsersDB from '../Models/Schema.js';

import { generateOtp,verifyLogin,verifyOtp,resendOtp, googleAuth, logout,forgotChangePassword, forgotVerifyEmail } from '../Controllers/UserController/authController.js';
import { getCategories } from '../Controllers/UserController/categoryController.js';
import { getParticularProduct,  getRelatedProduct } from '../Controllers/UserController/ProductController.js';
import { verifyUser } from '../Middlewares/userAuthMiddleware.js';
import { changePassword, getUserProfile, updateUserProfile } from '../Controllers/UserController/profileController.js';
import { addAddress, deleteAddress, editAddress, getAddress, getAddresses, setDefaultAddress } from '../Controllers/UserController/addressController.js';
import { verifyUserBlocked } from '../Middlewares/userBlockMiddleware.js';
import { addToCart, getCartProducts, proceedToCheckout, selectSizeForProduct, updateCart } from '../Controllers/UserController/cartController.js';
import { downloadInvoice, getAllOrders, getParticularOrder, orderRepayment, placeOrder, updateOrderStatus } from '../Controllers/UserController/orderController.js';
import { validateProduct } from '../Middlewares/productCheckerMiddleware.js';
import { addToWishlist, getWishlistProducts, removeFromWishlist,  } from '../Controllers/UserController/wishlistController.js';
import { getAllCoupons } from '../Controllers/CommonController/couponController.js';
import { getCheckoutAvailableCoupons } from '../Controllers/UserController/couponController.js';
import { couponActivation } from '../Middlewares/couponMiddleWares/couponActivation.js';
import { addMoneyToWallet, getWallet } from '../Controllers/UserController/walletController.js';
import { getProducts } from '../Controllers/CommonController/productController.js';
import { makePayment, paymentVerification } from '../Controllers/CommonController/razorPayController.js';
import { applyRefferal, changeFirstLoginStatus, getRefferalCode } from '../Controllers/UserController/refferalController.js';

import { placeFailedOrder } from '../Controllers/UserController/failedOrderController.js';

const router = express.Router();


// LOGIN AND SIGN UP ROUTES
router.post('/signup',generateOtp) //USER SIGNUP
router.post('/signup/otp',verifyOtp) //SIGN UP OTP
router.post('/login',verifyLogin) //USER LOGIN
router.post('/resendOtp',resendOtp) //USER RESEND OTP
router.post('/googleLogin',googleAuth)
router.post('/logout',logout)
router.post('/forgotPassword',forgotVerifyEmail)
router.patch('/forgotPassword',forgotChangePassword)

// categories
router.get('/categories',getCategories)

// products
router.get('/products',getProducts)
router.get('/products/:id',getParticularProduct)
router.get('/products/category/:catId',getRelatedProduct)

router.get('/',verifyUser,verifyUserBlocked,getUserProfile)
router.put('/',verifyUser,verifyUserBlocked,updateUserProfile)
router.patch('/',verifyUser,verifyUserBlocked,changePassword)

// address
router.get('/address',verifyUser,verifyUserBlocked,getAddresses)
router.post('/address',verifyUser,verifyUserBlocked,addAddress)
router.get('/address/:id',verifyUser,verifyUserBlocked,getAddress)
router.put('/address/:id',verifyUser,verifyUserBlocked,editAddress)
router.delete('/address/:id',verifyUser,verifyUserBlocked,deleteAddress)
router.patch('/address/:id',verifyUser,verifyUserBlocked,setDefaultAddress)


//cart
router.post('/cart/selectSize',selectSizeForProduct);
router.post('/cart',verifyUser,verifyUserBlocked,addToCart)
router.get('/cart',verifyUser,verifyUserBlocked,getCartProducts)
router.patch('/cart',verifyUser,verifyUserBlocked,updateCart);
router.post('/proceedToCheckout',verifyUser,verifyUserBlocked,proceedToCheckout)

//wishlist
router.post('/wishlist/:productId',verifyUser,verifyUserBlocked,addToWishlist)
router.get('/wishlist',verifyUser,verifyUserBlocked,getWishlistProducts)
router.patch('/wishlist/:productId',verifyUser,verifyUserBlocked,removeFromWishlist)


// order
router.post('/orders',verifyUser,verifyUserBlocked,validateProduct,couponActivation,placeOrder)
router.get('/orders',verifyUser,verifyUserBlocked,getAllOrders)
router.get('/orders/:orderId',verifyUser,verifyUserBlocked,getParticularOrder);
router.patch('/orders/:orderId',verifyUser,verifyUserBlocked,updateOrderStatus)
router.patch('/orders/repayment',verifyUser,verifyUserBlocked,validateProduct,couponActivation,orderRepayment)
router.get('/order/invoice/:orderId',verifyUser,verifyUserBlocked,downloadInvoice)

//failed orders
router.post('/failedOrders',verifyUser,verifyUserBlocked,validateProduct,couponActivation,placeFailedOrder)

router.post('/makePayment',verifyUser,verifyUserBlocked,makePayment)
router.post('/verifyPayment',verifyUser,verifyUserBlocked,paymentVerification)
//coupon
router.get('/coupons',verifyUser,verifyUserBlocked,getAllCoupons)
router.get('/coupons/checkoutAvailable',verifyUser,verifyUserBlocked,getCheckoutAvailableCoupons)

// wallet 
router.get('/wallet',verifyUser,verifyUserBlocked,getWallet);
router.patch('/wallet',verifyUser,verifyUserBlocked,addMoneyToWallet)

//refferal
router.get('/refferal',verifyUser,verifyUserBlocked,getRefferalCode)
router.post('/refferal',verifyUser,verifyUserBlocked,applyRefferal)
router.post('/closeReferral',verifyUser,verifyUserBlocked,changeFirstLoginStatus)


export default router;