const ExcelJS = require('exceljs');
const dataBarang = require('./baseData.json');

// Menghitung total nilai penjualan untuk semua barang
dataBarang.forEach(barang => {
  barang.totalNilaiPenjualan = barang.currentPrice * barang.soldAmount;
});

// Menghitung total nilai penjualan untuk semua barang
const totalNilaiPenjualan = dataBarang.reduce((total, barang) => total + barang.totalNilaiPenjualan, 0);

// Mengurutkan data barang berdasarkan total nilai penjualan secara descending
const dataBarangUrut = dataBarang.slice().sort((a, b) => b.totalNilaiPenjualan - a.totalNilaiPenjualan);

// Menghitung persentase kumulatif total nilai penjualan dan menentukan kategori ABC
let persentaseKumulatif = 0;
const kategori = dataBarangUrut.map(barang => {
  persentaseKumulatif += (barang.totalNilaiPenjualan / totalNilaiPenjualan) * 100;
  if (persentaseKumulatif <= 80) {
    return 'A';
  }
  if (persentaseKumulatif <= 95) {
    return 'B';
  }
  return 'C';
});

// Menampilkan hasil klasifikasi
let kumulatif = 0;
const hasil = dataBarangUrut.map((barang, index) => {
  const persentase = (barang.totalNilaiPenjualan / totalNilaiPenjualan) * 100;
  kumulatif += persentase;
  return {
    no: barang.sku,
    nama: barang.name,
    hargaBeli: barang.buyPrice,
    hargaJual: barang.currentPrice,
    penjualan: barang.soldAmount,
    persediaan: barang.stock,
    totalPenjualan: barang.totalNilaiPenjualan,
    totalPenjualanPersen: +persentase.toFixed(2),
    kumulatif: +kumulatif.toFixed(2),
    kategori: kategori[index],
  };
});

console.table(hasil);

// Menyimpan hasil ke dalam file Excel
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Hasil Klasifikasi');

worksheet.columns = [
  { header: 'No', key: 'no', width: 20 },
  { header: 'Nama', key: 'nama', width: 30 },
  { header: 'Harga Beli', key: 'hargaBeli', width: 15 },
  { header: 'Harga Jual', key: 'hargaJual', width: 15 },
  { header: 'Penjualan', key: 'penjualan', width: 15 },
  { header: 'Persediaan', key: 'persediaan', width: 15 },
  { header: 'Total Penjualan', key: 'totalPenjualan', width: 20 },
  { header: 'Total Penjualan (%)', key: 'totalPenjualanPersen', width: 20 },
  { header: 'Kumulatif', key: 'kumulatif', width: 20 },
  { header: 'Kategori', key: 'kategori', width: 10 },
];

hasil.forEach(data => {
  worksheet.addRow(data);
});

workbook.xlsx
  .writeFile('Hasil_Klasifikasi.xlsx')
  .then(() => {
    console.log('File Excel berhasil disimpan.');
  })
  .catch(err => {
    console.error('Gagal menyimpan file Excel:', err);
  });
