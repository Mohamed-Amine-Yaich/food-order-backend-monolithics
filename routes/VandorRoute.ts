import {Request,Response,NextFunction, Router} from "express";
import { GetVandorProfile, UpdateVandorProfile, UpdateVandorService, VandorLogin } from "../controllers";
import { checkAuth } from "../middelwares/auth";


const router =Router()

//log vandor 
router.post('/login',VandorLogin)
//add auth middellware

router.use(checkAuth)
//api that need authentication come after this
router.get('/profile',GetVandorProfile)
router.patch('/profile',UpdateVandorProfile)
router.patch('/service',UpdateVandorService)






export {router as VandorRoute}