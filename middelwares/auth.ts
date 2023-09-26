import { Request, Response, NextFunction } from "express";
import { VerifyJWT } from "../utility";
import { AuthPayload } from "../dto";


declare global {
     namespace Express {
        interface Request {
          vandor:AuthPayload
        }
    }


}

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization")?.split(" ")[1];
 
  if (token == undefined) {
    return res.json({ message: "you are not authenticated try to log in again" });
  }
  //verify token
  const vandorAuthPayload = await VerifyJWT(token) 
   req.vandor = vandorAuthPayload
  next()
};
