import {Request,Response,NextFunction, Router} from "express";


const router =Router()

router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('vendor route ')
})

export {router as VandorRoute}