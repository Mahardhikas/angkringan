'use client';
import SectionHeaders from "../components/layout/SectionHeaders";
import UserTabs from "../components/layout/UserTabs";
import { useProfile } from "../components/UseProfile";
import { dbTimeForHuman } from "../../libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(orders => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      });
  }

  function updateOrderStatus(orderId, status) {
    fetch(`/api/orders?_id=${orderId}&status=${status}`, {
      method: 'PATCH',
    })
      .then(res => {
        if (res.ok) {
          fetchOrders(); // Fetch orders again to update the UI
        }
      })
      .catch(error => {
        console.error('Failed to update order status:', error);
      });
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={profile.admin} isOwner={profile.owner} />
      <div className="mt-8">
        {loadingOrders ? (
          <div>Loading orders...</div>
        ) : (
          orders.length > 0 && orders.map(order => (
            <div
              key={order._id}
              className="bg-white mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
            >
              <div className="grow flex flex-col md:flex-row items-center gap-6">
                <div className="grow">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="grow">{order.nama}</div>
                    <div className="text-gray-500 text-sm">
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {order.cartProducts.map(p => p.name).join(', ')}
                  </div>
                  <div className="text-sm mt-2">
                    Status Pembayaran: <strong>
                      {order.paymentStatus === 'settlement' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                    </strong>
                  </div>
                  <div className="text-sm mt-2">
                    Status Pesanan: <strong>{order.orderStatus}</strong>
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                <button
                  onClick={() => updateOrderStatus(order._id, 'proses')}
                  className={`tab-button ${order.orderStatus === 'proses' ? 'active' : ''}`}
                >
                  Proses
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, 'selesai')}
                  className={`tab-button ${order.orderStatus === 'selesai' ? 'active' : ''}`}
                >
                  Selesai
                </button>
                <Link href={`/orders/${order._id}`} className="button">
                  Tunjukkan Pesanan
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
