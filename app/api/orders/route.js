import {authOptions, isAdmin, isOwner} from "../auth/[...nextauth]/route";
import {Order} from "../../../models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();
  const owner = await isOwner();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  let query = {};

  if (_id) {
    return Response.json(await Order.findById(_id));
  }

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (admin) {
    return Response.json(await Order.find(query));
  }

  if (owner) {
    return Response.json(await Order.find(query));
  }

  if (userEmail) {
    query.userEmail = userEmail;
    return Response.json(await Order.find(query));
  }
}
