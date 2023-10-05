import { Request, Response, NextFunction } from "express";
import { CustomerSignInInputsClass, CustomerSignUpInputsClass,CustomerUpdateProfileInputsClass,CustomerOTPVerificationInputs, CustomerCreateOrderInput } from "../dto";
import { Customer, Food,Order } from "../models";
import { GenerateOTP, GenerateRandomOrderId, GenerateSalt, GenrateJWT, HashPassword, RequestOTP, VerifyPassword } from "../utility";
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
    orders:[]
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
    
    const LoginInputs = plainToInstance(CustomerSignInInputsClass,req.body) 
    const validationErrors = await validate(LoginInputs, { validationError: { target: false } });
    
   console.log(validationErrors)
   
     if(validationErrors.length>0){
   
       return res.status(400).json({
         success: false,
         message:"Invalid Inputs",
       })
     }
     const {email,password}=LoginInputs
    const customer = await Customer.findOne({email})
    if(customer) { //the document exist 
  //confirm password 
  const PassVerificationResponse =  await VerifyPassword(password,customer.password)
 
if(PassVerificationResponse){
   //generate signature
   const token = await GenrateJWT({
    _id: customer._id,
    verified: customer.verified,
    email :customer.email
   })
 //send response 
 return res.status(200).json({
  success : true ,
  token ,
  data : {
    customer
  }
})
}
return res.status(404).json({
  error : 'wrong email or passwod'
})
 
    }




  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};

//verify the otp 
//take the otp from the body 
//for authenticated user 
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  
    //take the opt from req.body 
    //we can use the class definition instade of an interface 
    //transfer the req.body to an instance of the specific class to perform class validation using 
    // import {  plainToInstance } from 'class-transformer';
    //import {validate} from 'class-validator'
    const {otp}= <CustomerOTPVerificationInputs>req.body
    //get auth user from req.user  
    const _id = req.user._id
    const customer = await Customer.findById(_id);
    if(customer){
    //verify if the inputted otp is the same registred in the customer document and if the otp have expired 
    //customer optExpiry is later than the current time 
    //soon as the current date become later and the expiry is earlier then the otp is expired
    // console.log('Comparing current date and OTP expiry date',new Date(customer.otpExpiry),new Date() ,new Date(customer.otpExpiry)>new Date())
     if(customer.otp==otp&& new Date(customer.otpExpiry)>new Date()){
      customer.verified=true
     const verifiedCustomer =  await customer.save()
     if(verifiedCustomer){
      return res.status(200).json({
        success : true ,
        data:{
          customer : verifiedCustomer
        }
      })
     }

     
     }
     return res.status(500).json({
      error : 'otp is not correct or it have been expired '
    })
   
    }
    return res.status(500).json({
      error : 'cannot get customer by id ether connection to db problems or no user with this id'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};

export const  CustomerRequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.user._id
    const customer =await Customer.findById(customerId)
    
    if(customer){
      const {otp,otpExpiry} =GenerateOTP()
      customer.otp=otp
      customer.otpExpiry=otpExpiry
      const updated = await customer.save()
      if(updated)
      {
        await RequestOTP(customer.otp, customer.otpExpiry, customer.phone);
        return res.status(200).json({
          success: true,
          message: " message is send ",
          data: {
            otp: customer.otp,
            otpExpiry: customer.otpExpiry,
          },
        });
      }

      return res.status(200).json({
        error : 'something whent wrong when generating the otp' ,
      })
  
    }


      return res.json({ message: "no customer with this id is saved" });


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
    const  customerId=req?.user._id
    const customer =await Customer.findById(customerId)
    if(customer){
      return res.status(200).json({
        success : true ,
        data : {
          customer
        }
      })
  
    }

    return res.status(200).json({
      error : 'this user is no langer exist '
    })
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};

export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //validate Update customer req body
    const updateProfileInputs = plainToInstance(
      CustomerUpdateProfileInputsClass,
      req.body
    );
    const validationErrors = await validate(updateProfileInputs, {
      validationError: { target: false },
    });

    console.log(validationErrors);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Inputs",
      });
    }

    const customerId = req?.user._id;
    const customer = await Customer.findById(customerId);
    const { adress, firstName, lastName, phone } = updateProfileInputs;
    if (customer) {
      customer.phone = phone;
      customer.adress = adress;
      customer.firstName = firstName;
      customer.lastName = lastName;
      const updated  =await customer.save()
    if(updated){
      return res.status(200).json({
        success: true,
        data: {
          customer,
        },
      });
    }
      return res.status(200).json({
        success: false,
        error : 'user data is not updated'
      });
    }
    return res.status(500).json({
      error : 'cannot get user from db by Id'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};

//post customer/order
export const CustomerCreateOrder= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const  customerId=req?.user._id
    const customer =await Customer.findById(customerId)
    if (customer) {
      //get orders from req.body [{foodId: , unit: }]
      const orderInputs = <CustomerCreateOrderInput[]>req.body;

      //get latly inputted food
  const foodArrayIds = orderInputs.map(({foodId}) => foodId)

      const foods = await Food.find().where('_id').in(foodArrayIds)

      let totalAmount = 0.0;
     let  items =Array()
     
      //calculate the amount of the order
      foods.forEach((food) => {
        orderInputs.map(({ foodId, unit }) => {
    
          if ((food._id == foodId)) {
            totalAmount = totalAmount + unit * food.price;
            items.push({food,unit})
          }
        });
      });

      //create order

      const createdOrder =await  Order.create({
        orderId: GenerateRandomOrderId(), //generate a random orderID
        items,
        orderDate: new Date(),
        paidThrought: "COD",
        paymentResponse: "success",
        orderStatus: "waiting",
        totalAmount
      
      });

      // save order of the current user 
         customer.orders.push(createdOrder)
        const updatedCustomer =  await customer.save()
      if (createdOrder) {
        return res.status(200).json({
          success: true,
          data: {
            createdOrder,
          },
        });
      }
    }

    return res.status(200).json({
      success: false,
      error: "something went wrong ",
    });
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};


//get orders
// baseUrl/customer/orders 

export const CustomerGetAllOrders= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.user._id
    const currentCustomerOrders =await Customer.findById(customerId).populate('orders')
    if(currentCustomerOrders){
      return res.status(200).json({
        success : true ,
        data : {
          currentCustomerOrders
        }
      })
  
    }

    return res.status(400).json({
      error : 'cannot find orders for this customer '
    })
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};

//get order by id 
//  baseUrl/customer/order/:id

export const CustomerGetOrderById= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const  orderId=req?.params.id
    const currentOrder =await Order.findById(orderId).populate({
      path: 'items',
      populate: {
        path: 'food'
      }
    })//populate the list of the foods to order document instade of the id

    if(currentOrder){
      return res.status(200).json({
        success : true ,
        data : {
          orderItems : currentOrder.items
        }
      })
  
    }

    return res.status(400).json({
      error : 'this order is no langer exist '
    })
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error : 'internal error occured'
    })
  }
};