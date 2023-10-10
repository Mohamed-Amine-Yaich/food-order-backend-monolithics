import { Request, Response, NextFunction } from "express";
import {
  CreateFoodInput,
  CreateOfferInputs,
  UpdateOfferInputs,
  VandorAuthPayload,
  VandorLoginInput,
  VandorUpdateInput,
} from "../dto";
import { Food, Offer, Order, Vandor } from "../models";
import { GenrateJWT, VerifyPassword } from "../utility";



export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //before reading from the body must use body-parser to parse the body of the request into js object (depend of request content type)
    const { email, password } = <VandorLoginInput>req.body;

    //before create must check if email exist or not
    const vendorExist = await Vandor.findOne({ email });
    if (vendorExist != null) {
      //verify password
      const authticated = await VerifyPassword(password, vendorExist.password);

      if (authticated) {
        //return jwt
        const payload = {
          _id: vendorExist._id,
          email: vendorExist.email,
          name: vendorExist.name,
        };
        const jwt = await GenrateJWT(payload);
        return res.json({ jwt,vendorExist });
      }
      return res.json({
        message: "your email or password is not correct",
      });
    }

    return res.json({
      message: "your email or password is not correct",
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vandorId = req.user?._id;
    const vandor = await Vandor.findById(vandorId);

    if (vandor === null) {
      return res.json({ message: "there is no such vandor" });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: "success",
        vandor: vandor,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vandorId = req.user?._id;
    const vandor = await Vandor.findById(vandorId);

    if (vandor === null) {
      return res.json({ message: "there is no such vandor" });
    }
    const { name, foodType, adress } = <VandorUpdateInput>req.body;

    vandor.name = name;
    vandor.foodType = foodType;
    vandor.adress = adress;
    vandor.save();
    return res.status(200).json({
      success: true,
      data: {
        message: "updated !",
        vandor: vandor,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vandorId = req.user?._id;
    const vandor = await Vandor.findById(vandorId);

    if (vandor === null) {
      return res.json({ message: "there is no such vandor" });
    }
    //adding lng and lat to specific vendor for delivery 
    const {lat ,lng} = req.body
    if(lat&&lng){
      vandor.lat=lat
      vandor.lng=lng
    }
    vandor.serviceAvailable = !vandor.serviceAvailable;
    vandor.save();
    return res.status(200).json({
      success: true,
      data: {
        message: "updated !",
        vandor: vandor,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vandorId = req.user?._id;
    const vandor = await Vandor.findById(vandorId);
   console.log('files',req.files)
    const files=  req.files as [Express.Multer.File]
  const coverImages = files.map((file)=>file.filename) 
    

    if (vandor === null) {
      return res.json({ message: "there is no such vandor" });
    }
    if(coverImages.length>0){
      vandor.coverImage.push(...vandor.coverImage,...coverImages)
      vandor.save();
      return res.status(200).json({
        success: true,
        data: {
          message: "cover image updated updated !",
          vandor,
        },
      });
    }
    return res.status(500).json({
      success: false,
      data: {
        message: "files are not added correctly check your files extention !",
     
      },
    });
    
  } catch (error) {
    console.log(error);
  }
};


export const PostVandorNewFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logedvandorId = req.user?._id;
    const vandor = await Vandor.findById(logedvandorId);

    if (vandor === null) {
      return res.status(500).json({ message: "there is no account with such details please logIn again !" });
    }
    const {
      name,
      foodType,
      cathegory,
      discription,
      rating,
  /*     images, */
      price,
      readyTime,
    } = <CreateFoodInput>req.body;
    const FoodExist = await Food.findOne({ name });
    if (FoodExist) {
      return res.json({
        message: "food alrady exist in this vandor ",
      });
    }
    const files=  req.files as [Express.Multer.File]
    const coverImages = files.map((file)=>file.filename) 
      
  
    

    //create new food using food model
    const CreatedFood = await Food.create({
      name,
      discription,
      price,
      vandorId:logedvandorId,
      readyTime,
      cathegory,
      foodType,
      rating,
      images:coverImages,
    });

    //add the food to the current vandor that is currently login
  if(CreatedFood){
    vandor.foods.push(CreatedFood);
    vandor.save();
    return res.status(200).json({
      success: true,
      data: {
        message: "food is created !",
        vandor,
      },
    });
  }
  return res.status(500).json({
    success: false,
    data: {
      message: "An error occurred while creating the document in the database.!",

    },
  });
   
  } catch (error) {
    console.log(error);
  }
};
//GetVandorFood ,GetVandorAllFood
export const UpdateVandorFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logedvandorId = req.user?._id;
    const vandor = await Vandor.findById(logedvandorId);
    const FoodId = req.params.id
    if (vandor === null) {
      return res.status(500).json({ message: "there is no account with such details please logIn again !" });
    }
    const {
      name,
      foodType,
      cathegory,
      discription,
      rating,
      images,
      price,
      readyTime,
    } = <CreateFoodInput>req.body;
    
    const FoodExist = await Food.findById(FoodId);
   const NamefoodExist = await Food.findOne({name})
   if(NamefoodExist!=null){
    return res.status(400).json({
      success: false,
      data: {
        message: "Food occured with the same name!",
  
      },
    });
   }
    if (FoodExist) {
    FoodExist.name=name
    FoodExist.foodType=foodType
    FoodExist.discription=discription
    FoodExist.rating=rating
    FoodExist.images=images
    FoodExist.price=price
    FoodExist.readyTime=readyTime
    FoodExist.cathegory=cathegory
    FoodExist.save();

    return res.status(200).json({
      success: true,
      data: {
        message: "food is updated !",
        food: FoodExist,
      },
    });
    }
  

    return res.status(500).json({
      success: false,
      data: {
        message: "An error occurred while creating the document in the database.!",
  
      },
    });
    
   
  

   
  } catch (error) {
    console.log(error);
  }
};

export const GetVandorFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vandorId = req.user?._id;
    const foodId = req.params.id
    const food = await Food.findById(foodId);
    if(food===null){
      return res.status(500).json({
        success: false,
        data: {
          message: "there is no such food !",
         
        },
      });
    }
   if(food.vandorId==vandorId){
    return res.status(200).json({
      success: true,
      data: {
        message: "success!",
        food,
      },
    });
   }
   return res.status(500).json({
    success: false,
    data: {
      message: "no such food for this vandor !",
     
    },
  });
   
  } catch (error) {
    console.log(error);
  }
};
export const GetVandorAllFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    try {
      const vandorId = req.user?._id;
      const FoodList = await Food.find({vandorId});
     
      return res.status(200).json({
        success: true,
        data: {
          message: "success!",
          FoodList,
        },
      });
  } catch (error) {
    console.log(error);
  }
};

//vandor order 
//get order with vandor Id 
//get order details 
//process order

export const GetVendorOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    try {
      const vandorId = req.user?._id;
      const currentOrders = await Order.find({vandorId});
     if(currentOrders){
      return res.status(200).json({
        success: true,
        data: {
          message: "success!",
          currentOrders,
        },
      });
     }
    
     return res.status(500).json({
      success: false,
      error : 'error getting current vendor orders'
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    try {
   const orderId = req.params.id
    const currentOrder = await Order.findById(orderId).populate('items.food')
     if(currentOrder){
      return res.status(200).json({
        success: true,
        data: {
          message: "success!",
          currentOrder,
        },
      });
     }
    
     return res.status(500).json({
      success: false,
      error : 'error getting current order details'
    });
  } catch (error) {
    console.log(error);
  }
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const orderId = req.params.id
     const currentOrder = await Order.findById(orderId)
   const {orderStatus,readyTime,remarks} = req.body

      if(currentOrder){
       currentOrder.orderStatus=orderStatus
       currentOrder.readyTime=readyTime
       currentOrder.remarks=remarks
       const processedOrder = await currentOrder.save()
       if(processedOrder){
        return res.status(200).json({
          success: true,
          data: {
            message: "success!",
            processedOrder,
          },
        });

       }
    


     
      }
     
      return res.status(500).json({
       success: false,
       error : 'error getting current order details'
     });
    
  } catch (error) {
    console.log(error);
  }
};

/*-----------------vendor offers end points--------- */


export const AddVendorNewOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    //before creating the offer validate the occurence of the vendor
    const   VendorId= req.user._id
     const currentVendor = await Vandor.findById(VendorId)

      if(currentVendor){
        const {startValidity,endValidity,isActive,minValue,offerType,offerAmount,title,description,bank,bins,pinCode,promoCode,promoType} = <CreateOfferInputs>req.body
      let vendors  = []
      vendors.push(currentVendor)
     const  createdOffer  = await Offer.create({
     startValidity:  new Date(startValidity),
       endValidity :  new Date(endValidity) ,
        isActive,
        minValue,
        offerType,
        offerAmount,
        title,
        description,
        vendors,
        bank,
        bins,
        pinCode,
        promoCode,
        promoType
      })
      if(createdOffer){
        return res.status(200).json({
          success: true,
          data: {
            message: "success!",
            offer : createdOffer,
          },
        });
      }


      }
      return res.status(500).json({
        success: false,
        error : 'an error happend when creating the offer '
      });
     
    
  } catch (error) {
    console.log(error);
  }
};

export const UpdateVendorOfferById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const vendorId = req.user._id
  const   currentVendor = await Vandor.findById(vendorId)
 if(currentVendor) {
  const offerId = req.params.id
     const targetOffer = await Offer.findById(offerId)

    if(targetOffer){
      const {startValidity,endValidity,isActive,minValue,offerType,offerAmount,title,description,bank,bins,pinCode,promoCode,promoType} = <UpdateOfferInputs>req.body
   
      targetOffer.startValidity=new Date(startValidity)
      targetOffer.endValidity=new Date(endValidity) 
      targetOffer.isActive=isActive
      targetOffer.minValue=minValue
      targetOffer.offerType=offerType
      targetOffer.offerAmount=offerAmount
      targetOffer.description=description
      targetOffer.bank=bank
      targetOffer.bins=bins
      targetOffer.pinCode=pinCode
      targetOffer.title=title
      targetOffer.promoCode=promoCode
      targetOffer.promoType=promoType
   
       const updatedOffer = await targetOffer.save()
      if(updatedOffer){
        return res.status(200).json({
          success: true,
          data: {
            message: "success!",
            offer : updatedOffer,
          },
        });
      }
   
   
      }

  }

  

  
   return res.status(500).json({
     success: false,
     error : 'an error happend when updating the offer '
   });
  
    
  } catch (error) {
    console.log(error);
  }
};

//GetAllVendorOffers get all specific offers created by vendor admin and generic offer


export const GetAllVendorOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const vendorId = req.user._id
    const   currentVendor = await Vandor.findById(vendorId)
   if(currentVendor) {
  

    //or op to get genric offertype or vendor offer type with vendors  props list that contains the current vendor 
       const targetOffer = await Offer.find({  $or:[
       { $and: [
          { vendors: { $in: [vendorId] } },
          { offerType: 'VENDOR' }]},
          {offerType:'GENERIC'} 

       ]})
  
      if(targetOffer){
     
          return res.status(200).json({
            success: true,
            data: {
              message: "success!",
              offer : targetOffer,
            },
          });
      
     
     
        }
  
    }
  
    
  
    
     return res.status(500).json({
       success: false,
       error : 'an error happend when getting vendor offers '
     });
    
  } catch (error) {
    console.log(error);
  }
};