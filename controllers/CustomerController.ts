import { Request, Response, NextFunction } from "express";
import { CustomerSignUpInputsClass } from "../dto";
import { Customer, Vandor } from "../models";
import { GenerateOTP, GenerateSalt, GenrateJWT, HashPassword, RequestOTP } from "../utility";
import {  plainToInstance } from 'class-transformer';
import {validate} from 'class-validator'


export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  
   
  //  let userInstance = plainToClass(User, userJson); // to convert user plain object(userJson) to an instance of class user

  const Customerinputs = plainToInstance(CustomerSignUpInputsClass,req.body) 
 const validationErrors = await validate(Customerinputs, { validationError: { target: false } });
 
console.log(validationErrors)

  if(validationErrors.length>0){

    return res.status(400).json({
      success: false,
      message:"Invalid Inputs",
    })
  }
  
  
  const {firstName,lastName,password,email,phone,adress}=Customerinputs
      //before create must check if email exist or not
    const Existingcustomer = await Customer.findOne({ email });
    if (Existingcustomer) {
      return res.json({
        message: "customer alrady exist with this email adress",
      });
    }

    //generate otp and otp expiry date
    const {otp,otpExpiry} =GenerateOTP()

    //genrate salt
    const salt = await GenerateSalt();
    //encrypt password
    const hashedPassword = await HashPassword(password, salt);

    const CreatedCustomer = await Customer.create({
    firstName,
    lastName,
    salt,
    adress,
    email,
    phone,
    password:hashedPassword,
    verified:false,
    otp,
    otpExpiry,
    lat:0,
    lng:0,
    });

   if(CreatedCustomer){
    //send otp using twillio
    await RequestOTP(  CreatedCustomer.otp,CreatedCustomer.otpExpiry,CreatedCustomer.phone)
    // generate signature (jwt)
   const token  = await GenrateJWT({_id : CreatedCustomer._id,email:CreatedCustomer.email,verified:CreatedCustomer.verified})
   //return response with signature 
    return res.status(200).json({
      success : true ,
      token ,
      data : {
        Customer:CreatedCustomer
      }
    })
   }

   return res.status(500).json({
    error : 'internal error occured'
  })

    
  } catch (error) {
    console.log('error',error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get the id from the params
    const vendorId = req.params.id; // Get the ID from request parameters
    const vendor = await Vandor.findById(vendorId);

    if (vendor === null) {
      return res.json({ message: "no such vendor are saved" });
    }

    return res.json(vendor);
  } catch (error) {
    console.log(error);
  }
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  
      return res.json({ message: "no such vendor are saved" });


  } catch (error) {
    console.log(error);
  }
};

export const  CustomerRequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  
      return res.json({ message: "no such vendor are saved" });


  } catch (error) {
    console.log(error);
  }
};

export const  GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  
      return res.json({ message: "no such vendor are saved" });


  } catch (error) {
    console.log(error);
  }
};
export const  UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  
      return res.json({ message: "no such vendor are saved" });


  } catch (error) {
    console.log(error);
  }
};