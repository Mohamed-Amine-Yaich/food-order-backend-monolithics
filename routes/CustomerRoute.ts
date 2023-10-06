import {Request,Response,NextFunction, Router} from "express";
import {CustomerSignUp,CustomerLogin,CustomerVerify,CustomerRequestOTP,
    GetCustomerProfile,UpdateCustomerProfile,
    CustomerCreateOrder,CustomerGetAllOrders,CustomerGetOrderById,
    AddToCart,
    GetCart,
    DeleteCart} from "../controllers"
import { checkAuth } from "../middelwares";

const router = Router()

//public route 
router.post('/signup',CustomerSignUp)
router.post('/login',CustomerLogin)

//Authentication  using middelware
router.use(checkAuth)
//custom verify is verifying the otp and patch the user then patch I think 
router.patch('/verify',CustomerVerify)
router.get('/requestotp',CustomerRequestOTP)
router.get('/profile',GetCustomerProfile)
router.patch('/profile',UpdateCustomerProfile)

//cart 
router.post('/cart',AddToCart)
router.get('/cart',GetCart)
router.delete('/cart',DeleteCart)



//order 
//post order
router.post('/order',CustomerCreateOrder) 
//get orders
router.get('/orders',CustomerGetAllOrders) 

//get order by id 
router.get('/order/:id',CustomerGetOrderById)






router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('admin route')
})

export {router as CustomerRoute}