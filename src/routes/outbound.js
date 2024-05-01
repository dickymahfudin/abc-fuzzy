const express = require('express');
const { Op, col } = require('sequelize');
const moment = require('moment');
const _ = require('lodash');
const {
  ProductModel,
  OutboundModel,
  OutboundDetailModel,
  InboundModel,
  InboundDetailModel,
  sequelize,
  OutboundRefModel,
} = require('../models');
const generateTable = require('../helpers/generateTable');

const router = express.Router();
const title = 'Outbound';
const path = 'outbound';

const exclude = ['createdAt', 'updatedAt'];
const attributeProduct = Object.keys(ProductModel.getAttributes());
// const attributeInbound = Object.keys(InboundModel.getAttributes());
const attributeInboundDetail = Object.keys(InboundDetailModel.getAttributes());

router.get('/', (req, res) => res.render(`${path}/index`, { title }));

router.post('/', async (req, res) => {
  const { transactionDate, detail } = req.body;
  const transaction = await sequelize.transaction();
  const date = moment(transactionDate, 'DD-MM-YYYY HH:mm');
  const currentDate = moment();

  const errorAmount = detail.filter(e => e.amount < 1);

  if (errorAmount.length) return res.json({ success: false, message: 'QTY tidak boleh 0' });

  try {
    const productIds = _.map(detail, 'productId');
    const products = await ProductModel.findAll({ where: { id: productIds }, raw: true, nest: true });
    const inboundDetails = await InboundDetailModel.findAll({
      where: {
        productId: productIds,
        soldAmount: {
          [Op.lt]: col('amount'),
        },
      },
      order: [['createdAt', 'ASC']],
      raw: true,
      nest: true,
    });
    const groupinboundDetails = _.groupBy(inboundDetails, e => e.productId);

    const outbound = {
      transactionDate: date,
      totalPrice: 0,
      detail: [],
    };

    for (const det of detail) {
      const product = products.find(e => e.id === +det.productId);
      const amount = +det.amount;
      product.stock += amount;
      product.updatedAt = moment();

      let tempAmount = amount;
      const outboundDetailRef = [];
      const findInboundDetails = groupinboundDetails[product.id];
      if (!findInboundDetails) {
        return res.json({ success: false, message: 'Stock Tidak Tersedia' });
      }
      for (const idetail of findInboundDetails) {
        const calAmount = idetail.amount - idetail.soldAmount;
        const cuurentAmount = calAmount >= tempAmount ? tempAmount : calAmount;
        outboundDetailRef.push({
          inbound_detail_id: idetail.id,
          amount: cuurentAmount,
        });
        tempAmount -= calAmount;
        idetail.soldAmount += cuurentAmount;
        idetail.updatedAt = currentDate;
        if (tempAmount <= 0) break;
      }

      outbound.detail.push({
        productId: product.id,
        amount,
        currentPrice: product.currentPrice,
        createdAt: currentDate,
        updatedAt: currentDate,
        refs: outboundDetailRef,
      });
      outbound.totalPrice += amount * product.currentPrice;
    }

    // update stock product
    await ProductModel.bulkCreate(products, { updateOnDuplicate: attributeProduct, transaction });

    // update soldamount inbound Detail
    await InboundDetailModel.bulkCreate(inboundDetails, { updateOnDuplicate: attributeInboundDetail, transaction });

    // create outbound, detail and refs
    await OutboundModel.create(outbound, {
      include: [{ model: OutboundDetailModel, as: 'detail', include: [{ model: OutboundRefModel, as: 'refs' }] }],
      transaction,
    });

    await transaction.commit();
    return res.json({ success: true, message: 'Data Berhasil Ditambahkan' });
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return res.json({ success: false, message: 'Terjadi Kesalah pada server' });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { transactionDate, detail } = req.body;

  const transaction = await sequelize.transaction();
  const currentDate = moment();

  const errorAmount = detail.filter(e => e.amount < 1);

  if (errorAmount.length) return res.json({ success: false, message: 'QTY tidak boleh 0' });

  try {
    const productIds = _.map(detail, 'productId');
    let findInbound = await InboundModel.findOne({
      where: { id },
      include: [
        {
          model: InboundDetailModel,
          as: 'detail',
          include: [{ model: ProductModel, as: 'product' }],
        },
      ],
    });
    findInbound = findInbound.toJSON();
    const detailExisting = [];

    // revert data stock
    const revertProduct = [];
    const removeInboundDetailIds = [];
    const soldProduct = [];

    for (const det of findInbound.detail) {
      const { product } = det;
      const findDetail = detail.find(e => +e.id === det.id);

      if (!findDetail) removeInboundDetailIds.push(det.id);
      else detailExisting.push(det);

      if (det.soldAmount > 0) soldProduct.push(det);

      revertProduct.push({
        ...product,
        stock: product.stock - det.amount,
        updatedAt: currentDate,
      });
    }

    if (soldProduct.length) {
      return res.json({
        success: false,
        message: 'Tidak Dapat Merubah Transaksi, Dikaranakan ada produk yang sudah terjual ',
      });
    }
    await ProductModel.bulkCreate(revertProduct, { updateOnDuplicate: attributeProduct, transaction });

    // delete unwanted details
    if (removeInboundDetailIds.length)
      await InboundDetailModel.destroy({ where: { id: removeInboundDetailIds }, transaction });

    // create new inbound
    const inbound = {
      id: findInbound.id,
      transactionDate: moment(transactionDate, 'DD-MM-YYYY HH:mm'),
      totalPrice: 0,
      createdAt: findInbound.createdAt,
      updatedAt: currentDate,
    };
    const inboundDetail = [];
    const products = await ProductModel.findAll({ where: { id: productIds }, raw: true, nest: true, transaction });

    for (const det of detail) {
      const product = products.find(e => e.id === +det.productId);
      const amount = +det.amount;
      const findDet = detailExisting.find(e => e.id === +det.id);

      if (amount < 1) errorAmount.push(product);

      inboundDetail.push({
        ...findDet,
        productId: product.id,
        amount,
        buyPrice: product.buyPrice,
        updatedAt: currentDate,
      });
      inbound.totalPrice += amount * product.buyPrice;

      product.stock += amount;
      product.updatedAt = moment();
    }

    // update stock product
    await ProductModel.bulkCreate(products, { updateOnDuplicate: attributeProduct, transaction });

    // create inbound and inboud detail
    await InboundModel.upsert(inbound, { conflictFields: 'id', transaction });
    await InboundDetailModel.bulkCreate(inboundDetail, { updateOnDuplicate: attributeInboundDetail, transaction });

    await transaction.commit();
    return res.json({ success: true, message: 'Data Berhasil Diubah' });
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return res.json({ success: false, message: 'Terjadi Kesalah pada server' });
  }
});

router.get('/form', (req, res) => res.render(`${path}/form`, { title, action: `/${path}`, value: {} }));

router.get('/form/:id', async (req, res) => {
  const { id } = req.params;
  const value = await OutboundModel.findOne({
    where: { id },
    attributes: { exclude },
    include: [
      {
        model: OutboundDetailModel,
        as: 'detail',
        attributes: { exclude },
        include: [{ model: ProductModel, as: 'product' }],
      },
    ],
  });
  return res.render(`${path}/form`, { title, action: `/${path}/${id}`, value });
});

router.get('/table', async (req, res) => {
  const { startDate, endDate } = req.query;
  const options = {
    attributes: { exclude },
    include: [
      {
        model: OutboundDetailModel,
        as: 'detail',
        attributes: { exclude },
        include: [{ model: ProductModel, as: 'product', attributes: ['id', 'name'] }],
      },
    ],
  };
  const filter =
    startDate && endDate
      ? {
          transactionDate: {
            [Op.between]: [
              moment(startDate, 'DD-MM-YYYY').startOf('date').toDate(),
              moment(endDate, 'DD-MM-YYYY').endOf('date').toDate(),
            ],
          },
        }
      : {};

  const result = await generateTable({ req: req.query, model: OutboundModel, options, filter });
  result.data = result.data.map(e => {
    let renderDetail = `<ul>`;

    for (const det of e.detail) {
      renderDetail += `<li>${det.product?.name} - ${det.amount} pcs</li>`;
    }

    return {
      id: e.id,
      transactionNumber: `INVOICE-${_.padStart(e.id, 4, '0')}`,
      transactionDate: e.transactionDate,
      totalPrice: e.totalPrice,
      detail: renderDetail,
    };
  });

  return res.json(result);
});

module.exports = router;
