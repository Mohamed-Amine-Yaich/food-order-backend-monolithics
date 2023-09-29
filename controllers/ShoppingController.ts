import { Request, Response, NextFunction } from "express";
import {  Food, Vandor } from "../models";
import { FoodSearchInput } from "../dto";



export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode; 
    console.log(pincode)
 //check if the vandor is on service or not 
  const vandor = await Vandor.find({pincode,serviceAvailable:true})
  console.log(vandor)
  if(vandor==null){
    return res.status(200).json({
      success : true ,
      data:{
        message :'this vandor is not in service',
        vandor
      }
    })
  }
  return res.status(200).json({
    success : true ,
    data:{
      message :'this vandor is in service',
      vandor
    }
  })

  
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal server error"
    })
  }
};


export const GetTopRestaurants = async (
  req: Request,
  res: Response,
) => {
  try {
    const pincode = req.params.pincode; 
// find with a desending filter by rating
const TopVandors = await Vandor.find({pincode,serviceAvailable:true}).sort({ rating: -1 })
if (TopVandors === null) {
  return res.status(200).json({ message: "no vandor" });
}
return res.status(200).json({
  success : true ,
  data : {
  vandors: TopVandors//vandors in descending order
  }})
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal server error"
    })
  }
};

//GetTopRestaurants
export const GetFoodIn30Min= async (
  req: Request,
  res: Response,
) => {
  try {
  
    const pincode = req.params.pincode; // 

    //need to seek for vendor by pincode and populate food then apply the filter 
    //filter foods that take time less than 30  //lt , lte, gt ,gte
    //populate in Mongoose, you can use the populate method to retrieve a field in a model that refers to another model using a reference (typically an ObjectId) and populate it with the actual data from the referenced model.
    const vandor = await Vandor.findOne({pincode,serviceAvailable:true}).populate({path : 'foods',match:{readyTime : {$lt:30}}})
   console.log(vandor?._id)
    //re-use
    if (vandor === null || vandor.foods.length<1 ) {
      return res.status(200).json({ message: "there is no food available in 30 min" });
    }

    return res.status(200).json({
      success : true ,
      data : {
        message:'there is a list of  available food in 30 min',
        foods : vandor.foods//foods or food by filter 
      }})
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal server error"
    })
  }
};


export const GetFoodBySearch= async (
  req: Request,
  res: Response,
) => {
  try {
  
    const pincode = req.params.pincode; // 
  
const filter = <FoodSearchInput>req.body
// Define a regex pattern to match the filter input name anywhere in the author's name
//const regexPattern = new RegExp(filterInputName, 'i'); // 'i' makes the regex case-insensitive

const nameRegExp = new RegExp(filter.name) 
    //need to seek for vendor by pincode and populate food then apply the filter by the serach value of the input 
    const vendor = await Vandor.findOne({pincode,serviceAvailable:true}).populate({path : 'foods',match:{name :{$regex : nameRegExp  } }}) 
   
   
    //filter foods by the search value I think from body  

    if (vendor === null) {
      return res.json({ message: "no such vendor are saved" });
    }

    return res.status(200).json({
      success : true ,
      data : {
        food:vendor.foods//foods or food by filter 
      }})
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal server error"
    })
  }
};


export const GetRestaurantById = async (
  req: Request,
  res: Response,
) => {
  try {
    //get the id from the params
    const vendorId = req.params.id; // Get the ID from request parameters
    const vendor = await Vandor.findById(vendorId);
    //re-use
    if (vendor === null) {
      return res.json({ message: "no such vendor are saved" });
    }

    return res.status(200).json({
      success : true ,
      data : {
        vendor
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal server error"
    })
  }
};
