'use client';
import UserTabs from "../components/layout/UserTabs";
import {useProfile} from "../components/UseProfile";
import {dbTimeForHuman} from "../../libs/datetime";
import {useEffect, useState} from "react";
import OwnerTabs from "../components/layout/OwnerTabs";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const {loading, data: profile} = useProfile();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders(startDate = '', endDate = '') {
    setLoadingOrders(true);
    let url = '/api/orders';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    console.log("Fetching orders with URL:", url); // Debug log
    fetch(url)
      .then(res => res.json())
      .then(orders => {
        console.log("Orders fetched: ", orders); // Debug log
        setOrders(orders.reverse());
        setLoadingOrders(false);
      })
      .catch(error => {
        console.error("Error fetching orders:", error); // Debug log
        setLoadingOrders(false);
      });
  }  

  function cartProductPrice(product) {
    console.log("Product: ", product); // Log untuk cek data produk
    return product.basePrice * (product.quantity || 1); // Gunakan basePrice dan quantity
  }

  function handleFilter() {
    fetchOrders(startDate, endDate);
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <div className="my-2">
        <UserTabs isAdmin={profile.admin} isOwner={profile.owner} />
      </div>
        <OwnerTabs isOwner={profile.owner} />
      <div className="mt-8">
        <div className="flex mb-4">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="border py-2 px-4 mr-2"
          />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border py-2 px-4 mr-2"
          />
          <button 
            onClick={handleFilter} 
            className="bg-blue-500 text-white py-2 px-4">
            Filter
          </button>
        </div>
        {loadingOrders ? (
          <div>Loading report...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nama</th>
                <th className="py-2 px-4 border-b">Tanggal Order</th>
                <th className="py-2 px-4 border-b">Produk</th>
                <th className="py-2 px-4 border-b">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => {
                  let subtotal = 0;
                  if (order?.cartProducts) {
                    for (const product of order.cartProducts) {
                      subtotal += cartProductPrice(product);
                    }
                  }
                  console.log("Order subtotal: ", subtotal); // Log untuk cek subtotal
                  return (
                    <tr key={order._id}>
                      <td className="py-2 px-4 border-b text-center">{order.nama}</td>
                      <td className="py-2 px-4 border-b text-center">{dbTimeForHuman(order.createdAt)}</td>
                      <td className="py-2 px-4 border-b text-center">{order.cartProducts.map(p => p.name).join(', ')}</td>
                      <td className="py-2 px-4 border-b text-center">Rp.{subtotal}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="4">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
