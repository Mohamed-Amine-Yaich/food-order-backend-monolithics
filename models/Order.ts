import mongoose, { Schema, Document, Model } from "mongoose";
import { CreateFoodInput } from "../dto";

export interface OrderDoc extends Document {
    orderId: string;
    paidThrought: [string];
    orderDate: Date;
    paymentResponse: string;
    orderStatus: string;
    totalAmount :number; 
    items: [any]// [CreateFoodInput|string];//list of food ids or document 

}

export const OrderSchema = new Schema(
  {
    orderId: { type: String, required:true },
    paidThrought: { type: String , required:true},
    orderDate: { type: [], required:true },
    paymentResponse: { type: String, required:true },
    orderStatus: { type: String , required:true},
    items: [{
      food : { type: Schema.Types.ObjectId,ref: "food" , required : true},
      unit: { type:Number , required :true}
    }], //ref to  other schema
    totalAmount:{ type: Number, required:true }
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

const Order  = mongoose.model<OrderDoc>('order',OrderSchema)

export {Order}