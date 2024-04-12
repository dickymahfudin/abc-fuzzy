const moment = require('moment');
const _ = require('lodash');

const { ProductModel, InboundModel, InboundDetailModel } = require('../models');
const productData = require('./data/product.json');
const inboundData = require('./data/inbound.json');

const generateProduct = async () => await ProductModel.bulkCreate(productData);

const generateInbound = async () => {
  const inbound = [];

  const chunk = _.chunk(inboundData, 5);

  for (const details of chunk) {
    const detail = [];
    let amount = 0;

    for (const det of details) {
      const findProduct = await ProductModel.findOne({ where: { sku: det.sku } });
      amount += det.amount * det.buyPrice;
      detail.push({
        productId: findProduct.id,
        amount: det.amount,
        soldAmount: 0,
        buyPrice: det.buyPrice,
      });
    }
    inbound.push({
      transactionDate: moment(),
      totalPrice: amount,
      detail,
    });
  }

  await InboundModel.bulkCreate(inbound, { include: [{ model: InboundDetailModel, as: 'detail' }] });
};

module.exports = {
  generateProduct,
  generateInbound,
};
