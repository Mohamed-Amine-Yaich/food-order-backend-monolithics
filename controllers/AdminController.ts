import { Request, Response, NextFunction } from "express";
import { CreateOfferInputs, CreateVandorInput } from "../dto";
import { Offer, Vandor } from "../models";
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





/*-----------------vendor offers end points admin route--------- */


export const AddGenricOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
  
    const {startValidity,endValidity,isActive,minValue,offerType,offerAmount,title,description,bank,bins,pinCode,promoCode,promoType} = <CreateOfferInputs>req.body
  
     const  createdOfferByAdmin  = await Offer.create({
     startValidity:  new Date(startValidity),
       endValidity :  new Date(endValidity) ,
        isActive,
        minValue,
        offerType:offerType?offerType:"GENERIC",
        offerAmount,
        title,
        description,
        bank,
        bins,
        pinCode,
        promoCode,
        promoType
      })
      if(createdOfferByAdmin){
        return res.status(200).json({
          success: true,
          data: {
            message: "success!",
            offer : createdOfferByAdmin,
          },
        });
      }


           return res.status(500).json({
        success: false,
        error : 'an error happend when creating the offer '
      });
     
    
  } catch (error) {
    console.log(error);
  }
};

//not completed
export const UpdateOfferById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

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

  

  

  
   return res.status(500).json({
     success: false,
     error : 'an error happend when updating the offer '
   });
  
    
  } catch (error) {
    console.log(error);
  }
};

//GetAllOffers get all  offers created  

//bot completed
export const GetAllOffers = async (
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