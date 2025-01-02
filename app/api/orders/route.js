import { authOptions, isAdmin, isOwner } from "../auth/[...nextauth]/route";
import { Order } from "../../../models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import midtransClient from "midtrans-client";

const apiClient = new midtransClient.Snap({
  isProduction: false,  // ganti ke true jika sudah di produksi
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

async function updatePaymentStatus(order) {
  try {
    const statusResponse = await apiClient.transaction.status(order._id);
    order.paymentStatus = statusResponse.transaction_status;  // Update status pembayaran
    await order.save();  // Simpan perubahan di database
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
}

export async function GET(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const admin = await isAdmin();
    const owner = await isOwner();

    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const search = url.searchParams.get('search');
    const orderQuery = url.searchParams.get('order');

    let query = {};

    if (_id) {
      const order = await Order.findById(_id);
      await updatePaymentStatus(order);  // Perbarui status pembayaran dari Midtrans
      return Response.json(order);
    }

    if (search) {
      query.nama = { $regex: search, $options: 'i' };
    }

    if (orderQuery) {
      query['cartProducts'] = {
        $elemMatch: { name: { $regex: orderQuery, $options: 'i' } }
      };
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let orders;
    if (admin || owner) {
      orders = await Order.find(query);
    } else if (userEmail) {
      query.userEmail = userEmail;
      orders = await Order.find(query);
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    // Perbarui status pembayaran untuk setiap pesanan
    for (const order of orders) {
      await updatePaymentStatus(order);
    }

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", message: error.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    const newStatus = url.searchParams.get('status');

    if (!_id || !newStatus) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }

    const order = await Order.findById(_id);
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    // Perbarui status pesanan
    order.orderStatus = newStatus;
    await order.save();

    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", message: error.message }), { status: 500 });
  }
}

