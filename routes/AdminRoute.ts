import {Request,Response,NextFunction, Router} from "express";
import { CreateVandor, GetVandorById, GetVandors } from "../controllers";


const router = Router()

router.post('/vandor',CreateVandor)
router.get('/vandors',GetVandors)
router.get('/vandor/:id',GetVandorById)



router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('admin route')
})

export {router as AdminRoute}