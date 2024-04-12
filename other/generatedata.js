const fs = require('fs');
const path = require('path');

const dataPenjualan = [
  {
    nomorBarang: 89686596878,
    namaBarang: 'LAYS AYAM PG PAPRIKA 40',
    penjualan: 213,
  },
  {
    nomorBarang: 89686596885,
    namaBarang: 'LAYS AYAM PAPRIKA 65',
    penjualan: 512,
  },
  {
    nomorBarang: 89686598018,
    namaBarang: 'CHITATO SAPI PG 19',
    penjualan: 167,
  },
  {
    nomorBarang: 89686598025,
    namaBarang: 'CHITATO SAPI PG 40',
    penjualan: 408,
  },
  {
    nomorBarang: 89686598056,
    namaBarang: 'CHITATO SAPI PG 75',
    penjualan: 321,
  },
  {
    nomorBarang: 89686598162,
    namaBarang: 'CHITATO AYAM BBQ 19',
    penjualan: 275,
  },
  {
    nomorBarang: 89686598179,
    namaBarang: 'CHITATO AYAM BBQ 40',
    penjualan: 189,
  },
  {
    nomorBarang: 89686598186,
    namaBarang: 'CHITATO AYAM BBQ 75',
    penjualan: 422,
  },
  {
    nomorBarang: 89686598322,
    namaBarang: 'CHITATO ORIGINAL FLAVOUR 35 GR',
    penjualan: 136,
  },
  {
    nomorBarang: 89686598353,
    namaBarang: 'CHITATO ASLI 75',
    penjualan: 367,
  },
  {
    nomorBarang: 89686598414,
    namaBarang: 'CHITATO AYAM BUMBU 19',
    penjualan: 293,
  },
  {
    nomorBarang: 89686598421,
    namaBarang: 'CHITATO AYAM BUMBU 40',
    penjualan: 178,
  },
  {
    nomorBarang: 89686598476,
    namaBarang: 'CHITATO AYAM BUMBU 75',
    penjualan: 429,
  },
  {
    nomorBarang: 89686598575,
    namaBarang: 'CHITATO SAPI BAKAR 19',
    penjualan: 382,
  },
  {
    nomorBarang: 89686598582,
    namaBarang: 'CHITATO SAPI BUMBU B 40',
    penjualan: 244,
  },
  {
    nomorBarang: 89686598599,
    namaBarang: 'CHITATO SAPI BUMBU B 75',
    penjualan: 197,
  },
  {
    nomorBarang: 89686598650,
    namaBarang: 'CHITATO OKONOMIYAKI 85',
    penjualan: 314,
  },
  {
    nomorBarang: 89686598728,
    namaBarang: 'CHITATO SAPI PANGGANG 15',
    penjualan: 248,
  },
  {
    nomorBarang: 89686598766,
    namaBarang: 'CHITATO SAPI PANGGANG 168',
    penjualan: 183,
  },
  {
    nomorBarang: 89686598926,
    namaBarang: 'CHITATO KEJU SUPREME 15',
    penjualan: 497,
  },
  {
    nomorBarang: 89686598957,
    namaBarang: 'CHITATO KEJU SUPREME 75',
    penjualan: 342,
  },
  {
    nomorBarang: 89686599046,
    namaBarang: 'CHITATO FOODIE SEAWEED 55',
    penjualan: 215,
  },
  {
    nomorBarang: 89686600001,
    namaBarang: 'CHHETOS SHOTS JAGUNG BAKAR 15',
    penjualan: 165,
  },
  {
    nomorBarang: 89686600025,
    namaBarang: 'CHEETOS AYAM BAKAR 15',
    penjualan: 431,
  },
  {
    nomorBarang: 89686600223,
    namaBarang: 'CHEETOS JAGUNG BAKAR 18',
    penjualan: 289,
  },
  {
    nomorBarang: 89686600247,
    namaBarang: 'CHEETOS JAGUNG BAKAR 40',
    penjualan: 357,
  },
  {
    nomorBarang: 89686600346,
    namaBarang: 'CHEETOS KEJU AMERIKA 40',
    penjualan: 261,
  },
  {
    nomorBarang: 89686600513,
    namaBarang: 'CHEETOS NET BBQ 12',
    penjualan: 303,
  },
  {
    nomorBarang: 89686600544,
    namaBarang: 'CHEETOS NET BBQ 40',
    penjualan: 172,
  },
  {
    nomorBarang: 89686600810,
    namaBarang: 'CHEETOS NET SEAWEED 12',
    penjualan: 408,
  },
  // Masukkan data barang lainnya di sini
];
// Function untuk menghasilkan data penjualan per pembelian secara acak tanpa produk yang sama dalam satu pembelian
function generatePembelianRandom() {
  const pembelian = [];
  const produkTerpilih = new Set(); // Menggunakan Set untuk memastikan produk yang unik

  while (produkTerpilih.size < 5) {
    // Maksimal 5 produk per pembelian
    const randomIndex = Math.floor(Math.random() * dataPenjualan.length);
    const produk = dataPenjualan[randomIndex].namaBarang;
    const no = dataPenjualan[randomIndex].nomorBarang;

    if (!produkTerpilih.has(produk)) {
      produkTerpilih.add(produk);
      const jumlah = Math.ceil(Math.random() * 10); // Maksimal 10 barang per pembelian
      pembelian.push({ no, barang: produk, jumlah });
    }
  }

  return pembelian;
}

// Function untuk menghasilkan data penjualan per hari
function generateDataPenjualanHarian(dataBarang) {
  const dataHarian = [];
  dataBarang.forEach(barang => {
    const pembelianBarang = generatePembelianRandom(barang);
    dataHarian.push({ no: barang.nomorBarang, barang: barang.namaBarang, pembelian: pembelianBarang });
  });
  return dataHarian;
}

// Generate data penjualan harian untuk 7 hari ke belakang
const dataPenjualanHarian = [];
for (let hari = 0; hari < 7; hari++) {
  const dataHarian = generateDataPenjualanHarian(dataPenjualan);

  dataPenjualanHarian.push({ hari: hari + 1, data: dataHarian });
}
const res = [];
// Cetak data penjualan harian
dataPenjualanHarian.forEach(dataHarian => {
  //   console.log(`\nPembelian pada Hari ${dataHarian.hari}:`);
  dataHarian.data.forEach((item, index) => {
    // console.log(`Pembelian ke ${index + 1}`);
    const detail = [];
    item.pembelian.forEach(pembelian => {
      detail.push({
        no: pembelian.no,
        name: pembelian.barang,
        amount: pembelian.jumlah,
      });
    });
    res.push({
      transactionDatetime: (index += 1),
      day: dataHarian.hari,
      detail,
    });
  });
});

fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(res));
