// components/ProductLineChart.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProductLineChart({ productData }) {
  // Urutkan productData berdasarkan count dari besar ke kecil
  const sortedProductData = [...productData].sort((a, b) => b.count - a.count);

  const data = {
    labels: sortedProductData.map(item => item.name),
    datasets: [
      {
        label: 'Jumlah Pembelian Produk',
        data: sortedProductData.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pembelian Terbanyak',
      },
    },
  };

  return <Line data={data} options={options} />;
}
