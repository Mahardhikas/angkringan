import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { MenuItem } from "../../../models/MenuItem";
import { Order } from "../../../models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);

    const { cartProducts, meja } = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    const orderDoc = await Order.create({
        userEmail,
        ...meja,
        cartProducts,
        paid: false,
    });

    const itemDetails = [];
    for (const cartProduct of cartProducts) {
        const productInfo = await MenuItem.findById(cartProduct._id);

        let productPrice = productInfo.basePrice;
        if (cartProduct.size) {
            const size = productInfo.sizes.find(size => size._id.toString() === cartProduct.size._id.toString());
            productPrice += size.price;
        }
        if (cartProduct.extras?.length > 0) {
            for (const cartProductExtraThing of cartProduct.extras) {
                const productExtras = productInfo.extraIngredientPrices;
                const extraThingInfo = productExtras.find(extra => extra._id.toString() === cartProductExtraThing._id.toString());
                productPrice += extraThingInfo.price;
            }
        }

        const productName = cartProduct.name;

        itemDetails.push({
            id: cartProduct._id.toString(),
            price: productPrice,
            quantity: 1,
            name: productName,
        });
    }

    const parameter = {
        transaction_details: {
            order_id: orderDoc._id.toString(),
            gross_amount: itemDetails.reduce((total, item) => total + item.price * item.quantity, 0),
        },
        item_details: itemDetails,
        customer_details: {
            email: userEmail,
            first_name: meja.firstName,
            last_name: meja.lastName,
            phone: meja.phone,
            shipping_meja: {
                first_name: meja.firstName,
                last_name: meja.lastName,
                address: meja.street,
                city: meja.city,
                postal_code: meja.postalCode,
                phone: meja.phone,
                noMeja: meja.noMeja,
                nama: meja.nama,
                country_code: 'IDN',
            }
        }
    };

    try {
        const token = await snap.createTransactionToken(parameter);
        console.log('Generated token:', token);
        return NextResponse.json({ token });
    } catch (error) {
        console.error('Error generating token:', error);
        return NextResponse.json({ error: 'Failed to generate transaction token' });
    }
}
