import {IsEmail, Length} from "class-validator";


//need validation on cerain fields
export class CustomerSignUpInputsClass {
  
   @Length(5, 20)
   firstName : string
   
   @Length(5, 20)
   lastName : string

   @IsEmail()
   email : string

   @Length(8, 20)
   password : string
  
   @Length(5, 20)
   phone :string
   
   @Length(5,20)
   adress : string
}

export class CustomerSignInInputsClass {

   @IsEmail()
   email : string
   @Length(8, 20)
   password : string
}

export class CustomerUpdateProfileInputsClass {
  
   @Length(5, 20)
   firstName : string
   
   @Length(5, 20)
   lastName : string

 /*   @IsEmail()
   email : string

   @Length(8, 20)
   password : string */
  
   @Length(5, 20)
   phone :string
   
   @Length(5,20)
   adress : string
}

export interface CustomerOTPVerificationInputs{
   otp:string;
}
export interface CustomerAuthPayload {
   _id: string,
   email : string,
   verified: boolean;

}

export interface CustomerOrderItemsInput {
   foodId:string,
   unit: number
}


export interface CustomerCreateOrderInput {
   transId:string,
   amount : string
   items : [CustomerOrderItemsInput]
}