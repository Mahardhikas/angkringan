import { model, models, Schema } from "mongoose";

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
  paymentStatus: { type: String, default: 'pending' },
  orderStatus: { type: String, default: '' },  // Tambahkan ini
}, { timestamps: true });

export const Order = models?.Order || model('Order', OrderSchema);
