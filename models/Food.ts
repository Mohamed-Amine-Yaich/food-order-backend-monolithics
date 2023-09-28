import mongoose, { Schema, Document, Model } from "mongoose";

interface FoodDoc extends Document {
  name: string;
    discription: string;
    price: number;
    vandorId: string;
     readyTime: string;
     cathegory:string
     foodType: string;
     rating:number
     images:[string]
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
     images:{type : [String]}
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