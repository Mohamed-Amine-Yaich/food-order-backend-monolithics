import { Request, Response, NextFunction } from "express";
import { CreateOfferInputs, CreateVandorInput, UpdateOfferInputs } from "../dto";
import { Offer, Transaction, Vandor } from "../models";
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
      lat:0.0,
      lng:0.0
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


export const AddGenericOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
  
    const {startValidity,endValidity,isActive,minValue,offerAmount,title,description,bank,bins,pinCode,promoCode,promoType} = <CreateOfferInputs>req.body
  
     const  createdOfferByAdmin  = await Offer.create({
     startValidity:  new Date(startValidity),
       endValidity :  new Date(endValidity) ,
        isActive,
        minValue,
        offerType:"GENERIC",
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
      //need to handle vlaidation on req inputs
      const {startValidity,endValidity,isActive,minValue,offerAmount,title,description,bank,bins,pinCode,promoCode,promoType} = <UpdateOfferInputs>req.body
   
      targetOffer.startValidity=new Date(startValidity)
      targetOffer.endValidity=new Date(endValidity) 
      targetOffer.isActive=isActive
      targetOffer.minValue=minValue
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


export const GetAllOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
  
    // get all offers 
       const targetOffer = await Offer.find()
      if(targetOffer){
          return res.status(200).json({
            success: true,
            data: {
              message: "success!",
              offer : targetOffer,
            },
          });
        }
  
     return res.status(500).json({
       success: false,
       error : 'an error happend when getting vendor offers '
     });
    
  } catch (error) {
    console.log(error);
  }
};

//delete offer by id 


/* 
router.get('/transactions',GetAllTransactions)
router.get('/transaction/:id',GetTransactionById)
*/

export const GetAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get all
       const transactions = await Transaction.find()
      if(transactions){
          return res.status(200).json({
            success: true,
            data: {
              message: "success!",
              transactions,
            },
          });
        }
  
     return res.status(500).json({
       success: false,
       error : 'an error happend when getting all transactions '
     });
    
  } catch (error) {
    console.log(error);
  }
};


export const GetTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
  const transactionId = req.params.transId

    // get all offers 
       const targetTransaction = await Transaction.findById(transactionId)
      if(targetTransaction){
          return res.status(200).json({
            success: true,
            data: {
              message: "success!",
              targetTransaction,
            },
          });
        }
  
     return res.status(500).json({
       success: false,
       error : 'error when finding transaction occured'
     });
    
  } catch (error) {
    console.log(error);
  }
};

//not linked yet
export const GetAllDeliveryBoys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get all
       const transactions = await Transaction.find()
      if(transactions){
          return res.status(200).json({
            success: true,
            data: {
              message: "success!",
              transactions,
            },
          });
        }
  
     return res.status(500).json({
       success: false,
       error : 'an error happend when getting all transactions '
     });
    
  } catch (error) {
    console.log(error);
  }
};