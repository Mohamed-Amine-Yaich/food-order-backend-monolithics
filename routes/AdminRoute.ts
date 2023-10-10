import {Request,Response,NextFunction, Router} from "express";
import { AddGenericOffer, CreateVandor, GetAllOffers, GetAllTransactions, GetTransactionById, GetVandorById, GetVandors, UpdateOfferById } from "../controllers";


const router = Router()

router.post('/vandor',CreateVandor)
router.get('/vandors',GetVandors)
router.get('/vandor/:id',GetVandorById)


/* ------------offer end points -------- */

router.post('/offer',AddGenericOffer)
router.patch('/offer/:id',UpdateOfferById)
router.get('/offers',GetAllOffers)

/*-----------transactions----------*/
router.get('/transactions',GetAllTransactions)
router.get('/transaction/:transId',GetTransactionById)



router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('admin route')
})

export {router as AdminRoute}