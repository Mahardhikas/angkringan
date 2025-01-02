export function dbTimeForHuman(dateString) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta', // Zona waktu untuk Indonesia
  };
  
  const date = new Date(dateString);
  
  // Mendapatkan string lokal dengan format yang diinginkan
  const localTime = date.toLocaleString('id-ID', options);
  
  // Mengganti format tanggal yang ditambahkan koma dan mengganti titik dengan titik dua
  const [datePart, timePart] = localTime.split(' ');
  const formattedTime = timePart.replace(/\./g, ':'); // Mengganti semua titik dengan titik dua
  
  return `${datePart} ${formattedTime}`;
}
