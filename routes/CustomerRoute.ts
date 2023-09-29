import {Request,Response,NextFunction, Router} from "express";
import {CustomerSignUp,CustomerLogin,CustomerVerify,CustomerRequestOTP,GetCustomerProfile,UpdateCustomerProfile} from "../controllers"

const router = Router()

//public route 
router.post('/signup',CustomerSignUp)
router.post('/login',CustomerLogin)

//Authentication  using middelware


router.patch('/verify',CustomerVerify)
router.get('/requestotp',CustomerRequestOTP)
router.get('/profile',GetCustomerProfile)
router.patch('/profile',UpdateCustomerProfile)



router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('admin route')
})

export {router as CustomerRoute}