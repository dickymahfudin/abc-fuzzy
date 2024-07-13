const moment = require('moment');
const { Op, col, fn, literal, cast } = require('sequelize');
const { ProductModel, OutboundDetailModel, OutboundModel, OutboundRefModel } = require('../models');
const calculationABC = require('./calculationAbc');
const { fuzzyInference } = require('./calculationFuzzy');

const calculation = async (startDate, endDate) => {
  const where = {};
  if (startDate && endDate) {
    where.transactionDate = {
      [Op.between]: [
        moment(startDate, 'DD-MM-YYYY').startOf('date').toDate(),
        moment(endDate, 'DD-MM-YYYY').endOf('date').toDate(),
      ],
    };
  }

  const salesData = await OutboundDetailModel.findAll({
    attributes: [
      'productId',
      [col('product.stock'), 'stock'],
      [col('product.name'), 'name'],
      [col('product.buyPrice'), 'buyPrice'],
      [col('product.currentPrice'), 'currentPrice'],
      [cast(fn('SUM', literal('refs.amount * refs.currentPrice')), 'integer'), 'totalSales'],
      [cast(fn('SUM', literal('refs.amount')), 'integer'), 'soldAmount'],
    ],
    include: [
      {
        model: OutboundModel,
        as: 'outbound',
        attributes: [],
        where,
      },
      {
        model: ProductModel,
        as: 'product',
        attributes: [],
      },
      {
        model: OutboundRefModel,
        as: 'refs',
        attributes: [],
      },
    ],
    group: ['OutboundDetail.productId', 'product.stock', 'product.name'],
    order: [['productId', 'ASC']],
    raw: true,
  });
  const datas = salesData.map(data => ({
    ...data,
    totalSales: parseInt(data.totalSales, 10),
  }));
  const abc = calculationABC(datas);
  const fuzzy = abc.result.map(data => {
    const fuzzyCalculation = fuzzyInference(data.totalSalesPercentage, data.stock);
    return {
      name: data.name,
      stock: data.stock,
      fuzzy: fuzzyCalculation.z,
      ...fuzzyCalculation,
    };
  });

  return {
    abc: abc.result,
    fuzzy,
    totalSales: abc.totalSales,
  };
};

module.exports = calculation;
