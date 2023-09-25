import mongoose, { Schema, Document, Model } from "mongoose";

interface VandorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  adress: string;
  email: string;
  password: string;
  phone: string;
  salt: string;
  serviceAvailable: string;
  coverImage: [string];
  rating: number;
 // foods: string;
}

const VandorSchema = new Schema(
  {
    name: { type: String },
    ownerName: { type: String },
    foodType: { type: [] },
    pincode: { type: String },
    adress: { type: String },
    email: { type: String},
    password: { type: String , },
    phone: { type: String },
    salt: { type: String },
    serviceAvailable: { type: String },
    coverImage: { type: [String] },
    rating: { type: Number },
    //foods: [{ type: mongoose.SchemaTypes.ObjectId, ref: "food" }], //ref to  other schema
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Exclude the 'password' and other field from the JSON representation
        delete ret.password;
        delete ret.__v
        delete ret.salt
        delete ret._id
      },
    },
  }
);

const Vandor  = mongoose.model<VandorDoc>('vandor',VandorSchema)

export {Vandor}