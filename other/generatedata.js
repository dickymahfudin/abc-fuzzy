const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const dataBarang = require('./dataproduct.json');
const totalArray = 14;

const generateRandomArray = totalData => {
  let dataRandom = [];

  for (let i = 0; i < totalArray; i++) {
    const randomValue = Math.round(_.random(1, totalData));
    dataRandom.push(randomValue);
  }

  const totalRandom = _.sum(dataRandom);
  const scaleFactor = totalData / totalRandom;

  dataRandom = dataRandom.map(value => Math.round(value * scaleFactor));

  const sisa = totalData - _.sum(dataRandom);

  dataRandom[dataRandom.length - 1] += sisa;
  return dataRandom;
};

const generateTransaction = () => {
  const newData = [];
  const transactions = [];

  for (const data of dataBarang) {
    newData.push({
      sku: data.sku,
      name: data.name,
      transactions: generateRandomArray(data.totalPenjualan),
    });
  }

  for (let i = 0; i < 7; i++) {
    const details = [];
    for (let j = 0; j < 2; j++) {
      const shuffle = _.shuffle(newData);
      const chunks = _.chunk(shuffle, 5);
      for (const chunk of chunks) {
        const detail = [];
        for (const c of chunk) {
          const amount = c.transactions[i + j];
          if (amount > 0) {
            detail.push({
              sku: c.sku,
              amount,
            });
          }
        }
        details.push(detail);
      }
    }
    transactions.push({
      transaction: i + 1,
      details,
    });
  }
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(transactions));
};
generateTransaction();
// // // Gunakan fungsi untuk menghasilkan data random
// const jumlahData = 14;
// const total = 683;
// const dataRandom = generateRandomArray(total);
// console.log('Data random:', dataRandom);

// // Periksa hasil penjumlahan dari data random
// const sumResult = _.sum(dataRandom);
// console.log('Hasil penjumlahan:', sumResult);
