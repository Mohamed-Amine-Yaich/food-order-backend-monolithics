import { Request, Response, NextFunction } from "express";
import {
  CreateFoodInput,
  VandorAuthPayload,
  VandorLoginInput,
  VandorUpdateInput,
} from "../dto";
import { Food, Vandor } from "../models";
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
        return res.json({ jwt });
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
    const vandorId = req.vandor?._id;
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
    const vandorId = req.vandor?._id;
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
    const vandorId = req.vandor?._id;
    const vandor = await Vandor.findById(vandorId);

    if (vandor === null) {
      return res.json({ message: "there is no such vandor" });
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
    const vandorId = req.vandor?._id;
    const vandor = await Vandor.findById(vandorId);
console.log('files',req.files)
/*     const files=  req.files?.((file: Express.Multer.File)=>file.filename)
 */
    

    if (vandor === null) {
      return res.json({ message: "there is no such vandor" });
    }
    if(true){
      vandor.coverImage.push(...vandor.coverImage)
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
        message: "error occured !",
     
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
    const logedvandorId = req.vandor?._id;
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
      images,
      price,
      readyTime,
    } = <CreateFoodInput>req.body;
    const FoodExist = await Food.findOne({ name });
    if (FoodExist) {
      return res.json({
        message: "food alrady exist in this vandor ",
      });
    }
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
      images,
    });

    //add the food to the current vandor that is currently login
  if(CreatedFood){
    vandor.foods.push(CreatedFood);

    vandor.save();
    return res.status(200).json({
      success: true,
      data: {
        message: "food is created !",
        vandor: vandor,
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
    const logedvandorId = req.vandor?._id;
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
    const vandorId = req.vandor?._id;
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
      const vandorId = req.vandor?._id;
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
