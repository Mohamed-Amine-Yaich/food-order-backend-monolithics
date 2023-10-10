import { Request, Response, NextFunction } from "express";
import { Customer, DeliveryUser, } from "../models";
import {
 
  GenerateSalt,
  GenrateJWT,
  HashPassword,
  VerifyPassword,
} from "../utility"
//validating req inputs
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const DeliverySignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const { firstName, lastName, password, email, phone, adress ,lat,lng} = req.body
     
    //before create must check if email exist or not
    const ExistingDeliveryUser = await Customer.findOne({ email });
    if (ExistingDeliveryUser) {
      return res.json({
        message: "Delivery User is alrady exist with this email adress",
      });
    }

    //genrate salt
    const salt = await GenerateSalt();
    //encrypt password
    const hashedPassword = await HashPassword(password, salt);

    const deliveryUser = await DeliveryUser.create({
      firstName,
      lastName,
      salt,
      adress,
      email,
      password:hashedPassword,
      phone,
      isActive:true,
      verified: false,
      lat: lat?lat:0.0,
      lng: lng?lng:0.0,
    });

    if (deliveryUser) {
      // generate signature (jwt)
      const token = await GenrateJWT({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });
      //return response with signature
      return res.status(200).json({
        success: true,
        token,
        data: {
          deliveryUser : deliveryUser,
        },
      });
    }

    return res.status(500).json({
      error: "internal error occured",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: "internal error occured",
    });
  }
};

export const DeliverySignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
     //perofrm validating on the inputs
    const { email, password } = req.body;
    const deliveryUser = await DeliveryUser.findOne({ email });
    if (deliveryUser) {
      //the document exist
      //confirm password
      const PassVerificationResponse = await VerifyPassword(
        password,
        deliveryUser.password
      );

      if (PassVerificationResponse) {
        //generate signature
        const token = await GenrateJWT({
          _id: deliveryUser._id,
          verified: deliveryUser.verified,
          email: deliveryUser.email,
        });
        //send response
        return res.status(200).json({
          success: true,
          token,
          data: {
            deliveryUser,
          },
        });
      }
      return res.status(404).json({
        error: "wrong email or passwod",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal error occured",
    });
  }
};
