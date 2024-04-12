// Data barang
const dataBarang = [
  {
    no: 89686596878,
    nama: 'LAYS AYAM PG PAPRIKA 40',
    hargaBeli: 4189,
    hargaJual: 4800,
    totalPenjualan: 213,
    persediaan: 56,
  },
  {
    no: 89686596885,
    nama: 'LAYS AYAM PAPRIKA 65',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 512,
    persediaan: 92,
  },
  {
    no: 89686598018,
    nama: 'CHITATO SAPI PG 19',
    hargaBeli: 1586,
    hargaJual: 1900,
    totalPenjualan: 167,
    persediaan: 33,
  },
  {
    no: 89686598025,
    nama: 'CHITATO SAPI PG 40',
    hargaBeli: 4189,
    hargaJual: 4800,
    totalPenjualan: 408,
    persediaan: 74,
  },
  {
    no: 89686598056,
    nama: 'CHITATO SAPI PG 75',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 321,
    persediaan: 61,
  },
  {
    no: 89686598162,
    nama: 'CHITATO AYAM BBQ 19',
    hargaBeli: 1698,
    hargaJual: 1900,
    totalPenjualan: 275,
    persediaan: 47,
  },
  {
    no: 89686598179,
    nama: 'CHITATO AYAM BBQ 40',
    hargaBeli: 4189,
    hargaJual: 4800,
    totalPenjualan: 189,
    persediaan: 38,
  },
  {
    no: 89686598186,
    nama: 'CHITATO AYAM BBQ 75',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 422,
    persediaan: 85,
  },
  {
    no: 89686598322,
    nama: 'CHITATO ORIGINAL FLAVOUR 35 GR',
    hargaBeli: 4189,
    hargaJual: 4800,
    totalPenjualan: 136,
    persediaan: 26,
  },
  {
    no: 89686598353,
    nama: 'CHITATO ASLI 75',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 367,
    persediaan: 69,
  },
  {
    no: 89686598414,
    nama: 'CHITATO AYAM BUMBU 19',
    hargaBeli: 1586,
    hargaJual: 1900,
    totalPenjualan: 293,
    persediaan: 52,
  },
  {
    no: 89686598421,
    nama: 'CHITATO AYAM BUMBU 40',
    hargaBeli: 4189,
    hargaJual: 4800,
    totalPenjualan: 178,
    persediaan: 36,
  },
  {
    no: 89686598476,
    nama: 'CHITATO AYAM BUMBU 75',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 429,
    persediaan: 78,
  },
  {
    no: 89686598575,
    nama: 'CHITATO SAPI BAKAR 19',
    hargaBeli: 1586,
    hargaJual: 1900,
    totalPenjualan: 382,
    persediaan: 72,
  },
  {
    no: 89686598582,
    nama: 'CHITATO SAPI BUMBU B 40',
    hargaBeli: 4189,
    hargaJual: 4800,
    totalPenjualan: 244,
    persediaan: 43,
  },
  {
    no: 89686598599,
    nama: 'CHITATO SAPI BUMBU B 75',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 197,
    persediaan: 41,
  },
  {
    no: 89686598650,
    nama: 'CHITATO OKONOMIYAKI 85',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 314,
    persediaan: 59,
  },
  {
    no: 89686598728,
    nama: 'CHITATO SAPI PANGGANG 15',
    hargaBeli: 1700,
    hargaJual: 1900,
    totalPenjualan: 248,
    persediaan: 49,
  },
  {
    no: 89686598766,
    nama: 'CHITATO SAPI PANGGANG 168',
    hargaBeli: 14325,
    hargaJual: 16000,
    totalPenjualan: 183,
    persediaan: 34,
  },
  {
    no: 89686598926,
    nama: 'CHITATO KEJU SUPREME 15',
    hargaBeli: 1586,
    hargaJual: 1900,
    totalPenjualan: 497,
    persediaan: 88,
  },
  {
    no: 89686598957,
    nama: 'CHITATO KEJU SUPREME 75',
    hargaBeli: 7588,
    hargaJual: 8500,
    totalPenjualan: 342,
    persediaan: 64,
  },
  {
    no: 89686599046,
    nama: 'CHITATO FOODIE SEAWEED 55',
    hargaBeli: 6324,
    hargaJual: 7000,
    totalPenjualan: 215,
    persediaan: 42,
  },
  {
    no: 89686600001,
    nama: 'CHHETOS SHOTS JAGUNG BAKAR 15',
    hargaBeli: 800,
    hargaJual: 1000,
    totalPenjualan: 165,
    persediaan: 31,
  },
  {
    no: 89686600025,
    nama: 'CHEETOS AYAM BAKAR 15',
    hargaBeli: 850,
    hargaJual: 1000,
    totalPenjualan: 431,
    persediaan: 75,
  },
  {
    no: 89686600223,
    nama: 'CHEETOS JAGUNG BAKAR 18',
    hargaBeli: 850,
    hargaJual: 1000,
    totalPenjualan: 289,
    persediaan: 55,
  },
  {
    no: 89686600247,
    nama: 'CHEETOS JAGUNG BAKAR 40',
    hargaBeli: 2764,
    hargaJual: 3000,
    totalPenjualan: 357,
    persediaan: 68,
  },
  {
    no: 89686600346,
    nama: 'CHEETOS KEJU AMERIKA 40',
    hargaBeli: 2687,
    hargaJual: 3000,
    totalPenjualan: 261,
    persediaan: 53,
  },
  {
    no: 89686600513,
    nama: 'CHEETOS NET BBQ 12',
    hargaBeli: 762,
    hargaJual: 1000,
    totalPenjualan: 303,
    persediaan: 57,
  },
  {
    no: 89686600544,
    nama: 'CHEETOS NET BBQ 40',
    hargaBeli: 3161,
    hargaJual: 3500,
    totalPenjualan: 172,
    persediaan: 35,
  },
  {
    no: 89686600810,
    nama: 'CHEETOS NET SEAWEED 12',
    hargaBeli: 790,
    hargaJual: 1000,
    totalPenjualan: 408,
    persediaan: 73,
  },
  // Masukkan data barang lainnya di sini
];

// Menghitung total nilai penjualan untuk semua barang
dataBarang.forEach(barang => {
  barang.totalNilaiPenjualan = barang.hargaJual * barang.totalPenjualan;
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
const hasil = dataBarangUrut.map((barang, index) => ({
  nama: barang.nama,
  totalPenjualan: barang.totalNilaiPenjualan,
  totalPenjualanPersen: (barang.totalNilaiPenjualan / totalNilaiPenjualan) * 100,
  kategori: kategori[index],
}));
console.table(hasil);
