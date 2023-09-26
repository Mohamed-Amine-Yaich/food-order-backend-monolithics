import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GenerateSalt, HashPassword } from "../utility";

export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //before reading from the body must use body-parser to parse the body of the request into js object (depend of request content type)
    const {
      adress,
      email,
      name,
      ownerName,
      password,
      foodType,
      phone,
      pincode,
    } = <CreateVandorInput>req.body;

    //before create must check if email exist or not
    const vendorExist = await Vandor.findOne({ email });
    if (vendorExist) {
      return res.json({
        message: "vendor alrady exist with this email adress",
      });
    }
    //genrate salt
    const salt = await GenerateSalt();
    //encrypt password
    const hashedPassword = await HashPassword(password, salt);
    const CreateVandor = await Vandor.create({
      adress,
      name,
      password: hashedPassword,
      phone,
      pincode,
      ownerName,
      email,
      foodType,
      salt,
      serviceAvailable: true,
      rating: 4.5,
      coverImage: [
        "https://onecms-res.cloudinary.com/image/upload/s--NhBzlJY6--/f_auto,q_auto/c_fill,g_auto,h_622,w_830/v1/tdy-migration/17181582.JPG?itok=Ob61xW9w",
      ],
    });
    return res.json(CreateVandor);
  } catch (error) {
    console.log(error);
  }
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await Vandor.find();

    if (vendors === null || (vendors && vendors.length === 0)) {
      return res.json({ message: "no vendors are saved" });
    }

    return res.json(vendors);
  } catch (error) {
    console.log(error);
  }
};

export const GetVandorById = async (
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