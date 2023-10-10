import mongoose, { Schema, Document, Model } from "mongoose";

export interface TransactionDoc extends Document {
    customer: string;
    orderId: string;
    orderValue: number;//total amount
    vandorId: string;
    offerUsed: string;
    status:string
    paymentMode: string;
    paymenResponse:string;

}

const TransactionSchema = new Schema(
  {
  
    customer:{type : String},
    orderId:{type : String},
    orderValue: {type : Number},
    vandorId:{type : String},
    offerUsed: {type : String},
    status:{type : String},
    paymentMode: {type : String},
    paymenResponse:{type : String},
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

const Transaction  = mongoose.model<TransactionDoc>('transaction',TransactionSchema)

export {Transaction}