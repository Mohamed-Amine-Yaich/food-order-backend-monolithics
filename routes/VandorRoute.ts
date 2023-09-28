import { Router} from "express";
import { GetVandorAllFood, GetVandorFood, GetVandorProfile, PostVandorNewFood, UpdateVandorCoverImage, UpdateVandorFood, UpdateVandorProfile, UpdateVandorService, VandorLogin } from "../controllers";
import { checkAuth } from "../middelwares/auth";
import multer from "multer"

const storage = multer.diskStorage({

destination :(req, file, callback)=> {
   //callback(null,path.join(__dirname, 'images'))//this calback to determine the destination path
callback(null,process.cwd()+'/images')
},
filename(req, file, callback) {
    callback(null,Date.now()+`${file.originalname}`)//this callback to determine the name of the file original file name containe file extention
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

router.post('/food',PostVandorNewFood)
router.get('/food',GetVandorAllFood)
router.get('/food/:id',GetVandorFood)
router.patch('/food/:id',UpdateVandorFood)









export {router as VandorRoute}