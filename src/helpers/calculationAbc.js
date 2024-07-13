const calculationABC = datas => {
  const totalSales = datas.reduce((total, data) => total + data.totalSales, 0);

  const sortData = datas.slice().sort((a, b) => b.totalSales - a.totalSales);

  let cumulativePercentage = 0;
  const category = sortData.map(data => {
    cumulativePercentage += (data.totalSales / totalSales) * 100;
    if (cumulativePercentage <= 80) {
      return 'A';
    }
    if (cumulativePercentage <= 95) {
      return 'B';
    }
    return 'C';
  });

  let cumulative = 0;
  const result = sortData.map((data, index) => {
    const percentage = (data.totalSales / totalSales) * 100;
    cumulative += percentage;
    return {
      no: data.sku,
      name: data.name,
      buyPrice: data.buyPrice,
      currentPrice: data.currentPrice,
      soldAmount: data.soldAmount,
      stock: data.stock,
      totalSales: data.totalSales,
      totalSalesPercentage: +percentage.toFixed(2),
      cumulative: +cumulative.toFixed(2),
      category: category[index],
    };
  });

  return { result, totalSales };
};

module.exports = calculationABC;
