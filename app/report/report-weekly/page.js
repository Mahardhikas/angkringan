'use client';
import UserTabs from "../../components/layout/UserTabs";
import { useProfile } from "../../components/UseProfile";
import { dbTimeForHuman } from "../../../libs/datetime";
import { useEffect, useState } from "react";
import OwnerTabs from "../../components/layout/OwnerTabs";

// Fungsi untuk mendapatkan minggu dari tanggal
function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

// Fungsi untuk mendapatkan rentang minggu
function getWeekRange(date) {
  const weekNumber = getWeekNumber(date);
  const startDate = new Date(date.getFullYear(), 0, (weekNumber - 1) * 7 + 1);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return {
    startDate,
    endDate
  };
}

// Fungsi untuk memformat rentang tanggal
function formatDateRange(startDate, endDate) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return `${startDate.toLocaleDateString('id-ID', options)} - ${endDate.toLocaleDateString('id-ID', options)}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [totalOverall, setTotalOverall] = useState(0);
  const { loading, data: profile } = useProfile();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders(startDate, endDate);
  }, [startDate, endDate]);

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
        const weeklyData = groupOrdersByWeek(orders);
        setOrders(weeklyData);

        // Calculate total overall
        const total = weeklyData.reduce((sum, week) => sum + week.total, 0);
        setTotalOverall(total);

        setLoadingOrders(false);
      })
      .catch(error => {
        console.error("Error fetching orders:", error); // Debug log
        setLoadingOrders(false);
      });
  }

  function groupOrdersByWeek(orders) {
    const grouped = {};

    orders.forEach(order => {
      const weekDate = new Date(order.createdAt);
      const { startDate, endDate } = getWeekRange(weekDate);
      const year = weekDate.getFullYear();
      const weekKey = `${year}-${formatDateRange(startDate, endDate)}`;

      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          week: formatDateRange(startDate, endDate),
          orders: [],
          total: 0
        };
      }

      let subtotal = 0;
      if (order?.cartProducts) {
        for (const product of order.cartProducts) {
          subtotal += cartProductPrice(product);
        }
      }

      grouped[weekKey].orders.push(order);
      grouped[weekKey].total += subtotal;
    });

    return Object.values(grouped);
  }

  function cartProductPrice(product) {
    console.log("Product: ", product); // Log untuk cek data produk
    return product.basePrice * (product.quantity || 1); // Gunakan basePrice dan quantity
  }

  function handleFilter() {
    fetchOrders(startDate, endDate);
  }

  function handleWeekFilter(week) {
    const today = new Date();
    let range;

    if (week === 'this') {
      range = getWeekRange(today);
    } else if (week === 'last') {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      range = getWeekRange(lastWeek);
    }

    if (range) {
      setStartDate(range.startDate.toISOString().split('T')[0]);
      setEndDate(range.endDate.toISOString().split('T')[0]);
    }
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <div className="my-2">
        <UserTabs isAdmin={profile.admin} isOwner={profile.owner} />
      </div>
      <OwnerTabs isOwner={profile.owner} />
      <div className="mt-8">
        <div className="flex mb-4">
          <button 
            onClick={() => handleWeekFilter('this')} 
            className="bg-blue-500 text-white py-2 px-4 mr-2">
            This Week
          </button>
          <button 
            onClick={() => handleWeekFilter('last')} 
            className="bg-blue-500 text-white py-2 px-4 mr-2">
            Last Week
          </button>
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
            className="bg-blue-500 text-white py-2 px-4 items-center">
            Filter
          </button>
        </div>
        {loadingOrders ? (
          <div>Loading report...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Minggu</th>
                <th className="py-2 px-4 border-b">Total Orders</th>
                <th className="py-2 px-4 border-b">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(week => (
                  <tr key={week.week}>
                    <td className="py-2 px-4 border-b text-center">{week.week}</td>
                    <td className="py-2 px-4 border-b text-center">{week.orders.length}</td>
                    <td className="py-2 px-4 border-b text-center">Rp.{week.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="3">No orders found</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-2 px-4 border-b text-center">Total Keseluruhan : </td>
                <td></td>
                <td className="py-2 px-4 border-b text-center">Rp.{totalOverall}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </section>
  );
}
