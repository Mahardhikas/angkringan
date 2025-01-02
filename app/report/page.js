'use client'
import { useEffect, useState } from "react";
import UserTabs from "../components/layout/UserTabs";
import { useProfile } from "../components/UseProfile";
import { dbTimeForHuman } from "../../libs/datetime";
import OwnerTabs from "../components/layout/OwnerTabs";
import ProductLineChart from "../components/layout/ProductLineChart"; // Import the Line Chart Component

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const { loading, data: profile } = useProfile();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [productData, setProductData] = useState([]); // State for product data for the chart
  const [totalOmset, setTotalOmset] = useState(0); // State for total omset

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders(startDate = '', endDate = '', searchQuery = '', orderQuery = '') {
    setLoadingOrders(true);
    let url = '/api/orders';
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (searchQuery) queryParams.append('search', searchQuery);
    if (orderQuery) queryParams.append('order', orderQuery);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(orders => {
        setOrders(orders.reverse());
        calculateProductData(orders); // Calculate product data for the chart
        calculateTotalOmset(orders); // Calculate total omset
        setLoadingOrders(false);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
        setLoadingOrders(false);
      });
  }

  function calculateProductData(orders) {
    const productMap = new Map();

    orders.forEach(order => {
      order.cartProducts.forEach(product => {
        if (productMap.has(product.name)) {
          productMap.set(product.name, productMap.get(product.name) + 1);
        } else {
          productMap.set(product.name, 1);
        }
      });
    });

    const productDataArray = Array.from(productMap.entries()).map(([name, count]) => ({ name, count }));
    setProductData(productDataArray);
  }

  function calculateTotalOmset(orders) {
    const total = orders.reduce((sum, order) => {
      let subtotal = 0;
      if (order?.cartProducts) {
        for (const product of order.cartProducts) {
          subtotal += cartProductPrice(product);
        }
      }
      return sum + subtotal;
    }, 0);
    setTotalOmset(total);
  }

  function cartProductPrice(product) {
    return product.basePrice * (product.quantity || 1);
  }

  function handleFilter() {
    fetchOrders(startDate, endDate, searchQuery, orderQuery);
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <div className="my-2">
        <UserTabs isAdmin={profile.admin} isOwner={profile.owner} />
      </div>
      <OwnerTabs isOwner={profile.owner} />
      <div className="mt-8">
        {/* Your existing filters and table */}
        <div className="flex mb-4">
          {/* Inputs for filters */}
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
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Nama" 
            className="border py-2 px-4 mr-2"
          />
          <input 
            type="text" 
            value={orderQuery} 
            onChange={(e) => setOrderQuery(e.target.value)} 
            placeholder="Produk" 
            className="border py-2 px-4 mr-2"
          />
          <button 
            onClick={handleFilter} 
            className="bg-blue-500 text-white py-2 px-4">
            Filter
          </button>
        </div>
        
        {/* Existing orders table */}
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
        {/* Display total omset */}
        <div className="mb-4">
          <strong>Total Omset:</strong> Rp.{totalOmset}
        </div>      
      {/* Line Chart for Most Purchased Products */}
      <div className="mt-8">
          <ProductLineChart productData={productData} />
        </div>
    </section>
  );
}
