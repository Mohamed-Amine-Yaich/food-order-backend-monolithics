import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } from "../config";

// genereate otp
export const GenerateOTP = () => {
  let otp = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    otp += characters.charAt(randomIndex);
  }

  const currentDate = new Date(); //time UTC
  const otpExpiry = new Date(currentDate.getTime() + 15 * 60 * 1000); // 15 minutes in milliseconds

  return { otp, otpExpiry };
};

//request for OTP with twilio 

export const RequestOTP =(otp:string,otpExpiry:Date,CustomerPhone:string)=>{
try {
  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  
  client.messages
    .create({
      body: `Hello from AmineDelivery your one time code is ${otp}
      this code will expire after this date ${otpExpiry} `,
      to:CustomerPhone , // Text your number
      from: TWILIO_PHONE, // From a valid Twilio number

    })
   
} catch (error) {
  console.log(error)
  return error
}

  
 
} 