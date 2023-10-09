import {Request,Response,NextFunction, Router} from "express";
import { GetFoodAvailability, GetFoodBySearch, GetFoodIn30Min, GetRestaurantById, GetTopRestaurants ,
    GetOffersInSpecificArea
} from "../controllers";


const router = Router()

//food availablility => check all available food vandor that are on service
router.get('/:pincode',GetFoodAvailability)

//top-restaurant => get top restaurant by rating
router.get('/top-restaurants/:pincode',GetTopRestaurants)

/*------------------------ food available in 30 min--------------------------------- */

router.get('/food-in-30-min/:pincode',GetFoodIn30Min)

/*------------------------ Search for food --------------------------------- */

router.get('/search/:pincode',GetFoodBySearch)

/*------------------------ find Restaurant by Id --------------------------------- */

router.get('/restaurant/:id',GetRestaurantById)

/* --------------------------getOffersInSpecificLocation------------------------------- */
router.get('/offers/:pincode',GetOffersInSpecificArea)


router.get('/',(req:Request,res : Response,next:NextFunction)=>{
    res.json('this shopping route is not handled ')
})

export {router as ShoppingRoute}
///food-in-30-min/:pincode