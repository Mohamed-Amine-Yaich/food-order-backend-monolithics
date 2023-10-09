import {Request,Response,NextFunction, Router} from "express";
import { AddGenricOffer, CreateVandor, GetAllOffers, GetVandorById, GetVandors, UpdateOfferById } from "../controllers";


const router = Router()

router.post('/vandor',CreateVandor)
router.get('/vandors',GetVandors)
router.get('/vandor/:id',GetVandorById)


/* ------------offer end points-------- */

router.post('/offer/:id',AddGenricOffer)
router.get('/offer/:id',UpdateOfferById)
router.get('/offers',GetAllOffers)



router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('admin route')
})

export {router as AdminRoute}