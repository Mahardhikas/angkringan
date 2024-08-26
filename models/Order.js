import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  noMeja: String,
  nama: String,
  userEmail: String,
  phone: String,
  streetAddress: String,
  postalCode: String,
  city: String,
  country: String,
  cartProducts: Object,
  harga: Number,
  paid: {type: Boolean, default: true},
  
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);