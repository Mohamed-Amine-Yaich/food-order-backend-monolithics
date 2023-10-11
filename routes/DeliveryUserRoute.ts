import {Request,Response,NextFunction, Router} from "express";
import {DeliverySignUp,DeliverySignIn} from "../controllers"
import { checkAuth } from "../middelwares";

const router = Router()

//public route 
router.post('/signup',DeliverySignUp)
router.post('/signin',DeliverySignIn)

//Authentication  using middelware
// some protected route to get the deliveryUser profile and update some deliverUser data 


router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('admin route')
})

export {router as DeliveryUserRoute}