import { Router} from "express";
import { GetVandorAllFood, GetVandorFood, GetVandorProfile,
     PostVandorNewFood, UpdateVandorCoverImage, UpdateVandorFood, UpdateVandorProfile, UpdateVandorService, VandorLogin,
    GetVendorOrders,
    GetOrderDetails,
    ProcessOrder,
    AddVendorNewOffer,
    UpdateVendorOfferById,
    GetAllVendorOffers,
 } from "../controllers";
import { checkAuth } from "../middelwares/auth";
import multer from "multer"

const storage = multer.diskStorage({

destination :(req, file, callback)=> {
   //callback(null,path.join(__dirname, 'images'))//this calback to determine the destination path
callback(null,process.cwd()+'/images')
},
filename(req, file, callback) {
const fileName = parseInt(new Date().getTime().toString())+file.originalname
    callback(null,fileName)//this callback to determine the name of the file original file name containe file extention
},

})



export let upload = multer({storage,fileFilter(req, file, callback) {
    
    {
        const allowedFileTypes = ['image/jpeg','image/jpg','image/png']
    if(allowedFileTypes.includes(file.mimetype)){
        callback(null,true);

    }else{
        callback(null,false)
    }
    }
},limits:{files:10,fileSize:3000000, // Maximum file size (in bytes)
}})

const router =Router()

//log vandor 
router.post('/login',VandorLogin)
//add auth middellware

router.use(checkAuth)
//api that need authentication come after this
router.get('/profile',GetVandorProfile)
router.patch('/profile',UpdateVandorProfile)
router.patch('/coverImage',upload.array('coverImage',10),UpdateVandorCoverImage)
router.patch('/service',UpdateVandorService)

router.post('/food',upload.array('images',10),PostVandorNewFood)
router.get('/food',GetVandorAllFood)
router.get('/food/:id',GetVandorFood)
router.patch('/food/:id',UpdateVandorFood)

router.get('/orders',GetVendorOrders)
router.get('/order/:id',GetOrderDetails)
router.get('/order/:id/process',ProcessOrder)

//offers CRUD
router.post('/offer',AddVendorNewOffer)
router.patch('/offer/:id',UpdateVendorOfferById)
router.get('/offers',GetAllVendorOffers)









export {router as VandorRoute}