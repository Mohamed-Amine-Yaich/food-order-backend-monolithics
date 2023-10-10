import mongoose, { Schema, Document, Model } from "mongoose";
import { CreateFoodInput } from "../dto";

export interface OrderDoc extends Document {
    orderId: string;
    vandorId : string,
    orderDate: Date;
    orderStatus: string;
    totalAmount :number; 
    items: [any]// [CreateFoodInput|string];//list of food ids or document 
    remarks :string
    deliveryId : string
    readyTime : number // 60 min
    paidAmount :number; 

}

export const OrderSchema = new Schema(
  {
    orderId: { type: String, required:true },
    vandorId: { type: String, required:true },
    orderDate: { type: [], required:true },
    orderStatus: { type: String , required:true},
    items: [{
      food : { type: Schema.Types.ObjectId,ref: "food" , required : true},
      unit: { type:Number , required :true}
    }], //ref to  other schema
    totalAmount:{ type: Number },
    paidAmount:{ type: Number },
    remarks :{ type: String },
    deliveryId : { type: String },
    readyTime : { type: Number }, // 60 min
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