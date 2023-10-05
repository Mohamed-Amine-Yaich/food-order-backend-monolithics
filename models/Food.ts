import mongoose, { Schema, Document, Model } from "mongoose";
import multer from "multer";

type Ifile = Express.Multer.File

export interface FoodDoc extends Document {
  name: string;
    discription: string;
    price: number;
    vandorId: string;
     readyTime: string;
     cathegory:string
     foodType: string;
     rating:number
     images:[Express.Multer.File]
}

const FoodSchema = new Schema(
  {
    name: {type : String},
    discription: {type:String},
    price: {type : Number},
    vandorId: {type : String},
    readyTime: {type : String},
    cathegory:{type : String},
    foodType: {type : String},
    rating:{type : Number},
    images:{type:[Object]as unknown as  [Ifile], required :true} //work around 
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Exclude the 'password' and other field from the JSON representation
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        
      },
    },
  }
);

const Food  = mongoose.model<FoodDoc>('food',FoodSchema)

export {Food}