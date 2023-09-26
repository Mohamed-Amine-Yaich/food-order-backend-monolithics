import { Request, Response, NextFunction } from "express";
import { VandorAuthPayload, VandorLoginInput, VandorUpdateInput } from "../dto";
import { Vandor } from "../models";
import { GenrateJWT, VerifyPassword } from "../utility";

interface ICustomReq extends Request {
  vandor: VandorAuthPayload;
}

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

    return  res.status(200).json({
      success: true,
      data: {
        message: 'success',
        vandor: vandor
      }
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
        message: 'updated !',
        vandor: vandor
      }
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
        message: 'updated !',
        vandor: vandor
      }
    });
  } catch (error) {
    console.log(error);
  }
}