import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { VandorAuthPayload,AuthPayload } from "../dto";

const GenerateSalt = async () => {
  return bcrypt.genSalt();
};

const HashPassword = async (password: string, salt: string) => {
  return bcrypt.hash(password, salt);
};

const VerifyPassword = async (password: string, hashedPassword: string) => {
  console.log(
    password,
    hashedPassword,
    await bcrypt.compare(password, hashedPassword)
  );
  return await bcrypt.compare(password, hashedPassword);
};

const GenrateJWT = async (payload:AuthPayload ) => {
  return jwt.sign(payload, SECRET_KEY);
};

const VerifyJWT = async (token: string) => {
  return  jwt.verify(token, SECRET_KEY) as  AuthPayload
};

export { GenerateSalt, HashPassword, VerifyPassword, GenrateJWT, VerifyJWT };
