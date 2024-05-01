const moment = require('moment');
const _ = require('lodash');

const {
  ProductModel,
  InboundModel,
  InboundDetailModel,
  OutboundModel,
  OutboundDetailModel,
  OutboundRefModel,
} = require('../models');
const productData = require('./data/product.json');
const inboundData = require('./data/inbound.json');
const outboundData = require('./data/outbound.json');

const subDate = 7;
const date = moment().subtract(subDate, 'day');

const generateProduct = async () => await ProductModel.bulkCreate(productData);

const generateInbound = async () => {
  const inbound = [];

  const chunk = _.chunk(inboundData, 5);
  const products = await ProductModel.findAll({ raw: true, nest: true });

  for (const details of chunk) {
    const detail = [];
    let totalPrice = 0;

    for (const det of details) {
      const findProduct = products.find(e => e.sku === det.sku);
      totalPrice += det.amount * det.buyPrice;
      detail.push({
        productId: findProduct.id,
        amount: det.amount,
        soldAmount: det.soldAmount,
        buyPrice: det.buyPrice,
        createdAt: date,
        updatedAt: date,
      });
    }
    inbound.push({
      transactionDate: date,
      totalPrice,
      createdAt: date,
      updatedAt: date,
      detail,
    });
  }

  await InboundModel.bulkCreate(inbound, { include: [{ model: InboundDetailModel, as: 'detail' }] });
};

const generateOutbound = async () => {
  const products = await ProductModel.findAll({ raw: true, nest: true });
  const inboundDetail = await InboundDetailModel.findAll({ raw: true, nest: true });
  const outbound = [];

  for (const [i, outbounds] of outboundData.entries()) {
    for (const [y, od] of outbounds.details.entries()) {
      const newDate = date.clone().subtract({ date: subDate - i, minute: y });
      const detail = [];
      let totalPrice = 0;
      for (const ot of od) {
        const findProduct = products.find(e => e.sku === ot.sku);
        const findInbound = inboundDetail.find(e => e.productId === findProduct.id);
        totalPrice = ot.amount * findProduct.currentPrice;
        detail.push({
          productId: findProduct.id,
          amount: ot.amount,
          currentPrice: findProduct.currentPrice,
          createdAt: newDate,
          updatedAt: newDate,
          refs: [
            {
              inboundDetailId: findInbound.id,
              amount: ot.amount,
              buyPrice: findInbound.buyPrice,
              currentPrice: findProduct.currentPrice,
              createdAt: newDate,
              updatedAt: newDate,
            },
          ],
        });
      }

      outbound.push({
        transactionDate: newDate,
        totalPrice,
        createdAt: newDate,
        updatedAt: newDate,
        detail,
      });
    }
  }
  await OutboundModel.bulkCreate(outbound, {
    include: [{ model: OutboundDetailModel, as: 'detail', include: [{ model: OutboundRefModel, as: 'refs' }] }],
  });
};

module.exports = {
  generateProduct,
  generateInbound: () => {},
  generateOutbound: () => {},
};
