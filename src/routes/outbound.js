const express = require('express');
const { Op, col } = require('sequelize');
const moment = require('moment');
const _ = require('lodash');
const {
  ProductModel,
  OutboundModel,
  OutboundDetailModel,
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
      if (!product) return res.json({ success: false, message: 'Produk Tidak ditemukkan' });

      const amount = +det.amount;
      product.stock -= amount;
      product.updatedAt = currentDate;
      if (product.stock < 0) {
        return res.json({ success: false, message: `Stock ${product.name} Tidak Tersedia ` });
      }

      let tempAmount = amount;
      const outboundDetailRef = [];
      const findInboundDetails = groupinboundDetails[product.id];
      if (!findInboundDetails) {
        return res.json({ success: false, message: `Stock ${product.name} Tidak Tersedia ` });
      }
      for (const idetail of findInboundDetails) {
        const calAmount = idetail.amount - idetail.soldAmount;
        const cuurentAmount = calAmount >= tempAmount ? tempAmount : calAmount;
        outboundDetailRef.push({
          inboundDetailId: idetail.id,
          amount: cuurentAmount,
          buyPrice: product.buyPrice,
          currentPrice: product.currentPrice,
        });
        tempAmount -= calAmount;
        idetail.soldAmount += cuurentAmount;
        idetail.updatedAt = currentDate;
        if (tempAmount <= 0) break;
      }
      if (tempAmount > 0) {
        return res.json({ success: false, message: `Stock ${product.name} Tidak Tersedia ` });
      }
      outbound.detail.push({
        productId: product.id,
        amount,
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
    let findOutbound = await OutboundModel.findOne({
      where: { id },
      include: [
        {
          model: OutboundDetailModel,
          as: 'detail',
          include: [
            { model: ProductModel, as: 'product' },
            { model: OutboundRefModel, as: 'refs', include: [{ model: InboundDetailModel, as: 'inboundDetail' }] },
          ],
        },
      ],
    });
    findOutbound = findOutbound.toJSON();

    const detailExisting = [];

    // revert data stock
    const revertProduct = [];
    const removeOutboundDetailIds = [];
    const revertRefsIds = [];
    const revertInboundDetail = [];

    for (const det of findOutbound.detail) {
      const { product, refs } = det;
      const findDetail = detail.find(e => +e.id === det.id);

      if (!findDetail) removeOutboundDetailIds.push(det.id);
      else detailExisting.push(det);

      revertProduct.push({
        ...product,
        stock: product.stock + det.amount,
        updatedAt: currentDate,
      });
      revertRefsIds.push(...refs.map(e => e.id));
      revertInboundDetail.push(
        ...refs.map(e => ({
          ...e.inboundDetail,
          soldAmount: e.inboundDetail.soldAmount - e.amount,
          updatedAt: currentDate,
        })),
      );
    }

    await ProductModel.bulkCreate(revertProduct, { updateOnDuplicate: attributeProduct, transaction });
    await InboundDetailModel.bulkCreate(revertInboundDetail, {
      updateOnDuplicate: attributeInboundDetail,
      transaction,
    });

    // delete unwanted details
    if (removeOutboundDetailIds.length)
      await OutboundDetailModel.destroy({ where: { id: removeOutboundDetailIds }, transaction });

    //delete refs
    if (revertRefsIds.length) await OutboundRefModel.destroy({ where: { id: revertRefsIds }, transaction });

    // create new Outbound
    const outbound = {
      id: findOutbound.id,
      transactionDate: moment(transactionDate, 'DD-MM-YYYY HH:mm'),
      totalPrice: 0,
      createdAt: findOutbound.createdAt,
      updatedAt: currentDate,
    };
    const outboundDetail = [];
    const products = await ProductModel.findAll({ where: { id: productIds }, transaction, raw: true, nest: true });
    const inboundDetails = await InboundDetailModel.findAll({
      where: {
        productId: productIds,
        soldAmount: {
          [Op.lt]: col('amount'),
        },
      },
      order: [['createdAt', 'ASC']],
      transaction,
      raw: true,
      nest: true,
    });
    const groupinboundDetails = _.groupBy(inboundDetails, e => e.productId);

    for (const det of detail) {
      const product = products.find(e => e.id === +det.productId);

      if (!product) return res.json({ success: false, message: 'Produk Tidak ditemukkan' });

      const amount = +det.amount;
      const findDet = detailExisting.find(e => e.id === +det.id);

      product.stock -= amount;
      product.updatedAt = currentDate;
      if (product.stock < 0) {
        return res.json({ success: false, message: `Stock ${product.name} Tidak Tersedia ` });
      }

      let tempAmount = amount;
      const outboundDetailRef = [];
      const findInboundDetails = groupinboundDetails[product.id];
      if (!findInboundDetails) {
        return res.json({ success: false, message: `Stock ${product.name} Tidak Tersedia ` });
      }
      for (const idetail of findInboundDetails) {
        const calAmount = idetail.amount - idetail.soldAmount;
        const cuurentAmount = calAmount >= tempAmount ? tempAmount : calAmount;
        outboundDetailRef.push({
          inboundDetailId: idetail.id,
          amount: cuurentAmount,
          buyPrice: product.buyPrice,
          currentPrice: product.currentPrice,
        });
        tempAmount -= calAmount;
        idetail.soldAmount += cuurentAmount;
        idetail.updatedAt = currentDate;
        if (tempAmount <= 0) break;
      }
      if (tempAmount > 0) {
        return res.json({ success: false, message: `Stock ${product.name} Tidak Tersedia ` });
      }
      outboundDetail.push({
        ...findDet,
        productId: product.id,
        amount,
        createdAt: currentDate,
        updatedAt: currentDate,
        refs: outboundDetailRef,
      });
      outbound.totalPrice += amount * product.currentPrice;
    }

    // update soldamount inbound Detail
    await InboundDetailModel.bulkCreate(inboundDetails, { updateOnDuplicate: attributeInboundDetail, transaction });

    // update stock product
    await ProductModel.bulkCreate(products, { updateOnDuplicate: attributeProduct, transaction });

    // create outbound and outbound detail
    await OutboundModel.upsert(outbound, { conflictFields: 'id', transaction });
    await OutboundDetailModel.bulkCreate(outboundDetail, {
      updateOnDuplicate: attributeInboundDetail,
      include: [{ model: OutboundRefModel, as: 'refs' }],
      transaction,
    });

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

router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  const currentDate = moment();
  try {
    let findOutbound = await OutboundModel.findOne({
      where: { id },
      include: [
        {
          model: OutboundDetailModel,
          as: 'detail',
          include: [
            { model: ProductModel, as: 'product' },
            { model: OutboundRefModel, as: 'refs', include: [{ model: InboundDetailModel, as: 'inboundDetail' }] },
          ],
        },
      ],
    });
    findOutbound = findOutbound.toJSON();
    // revert data stock
    const revertProduct = [];
    const revertRefsIds = [];
    const revertInboundDetail = [];

    for (const det of findOutbound.detail) {
      const { product, refs } = det;

      revertProduct.push({
        ...product,
        stock: product.stock + det.amount,
        updatedAt: currentDate,
      });
      revertRefsIds.push(...refs.map(e => e.id));
      revertInboundDetail.push(
        ...refs.map(e => ({
          ...e.inboundDetail,
          soldAmount: e.inboundDetail.soldAmount - e.amount,
          updatedAt: currentDate,
        })),
      );
    }

    await ProductModel.bulkCreate(revertProduct, { updateOnDuplicate: attributeProduct, transaction });
    await InboundDetailModel.bulkCreate(revertInboundDetail, {
      updateOnDuplicate: attributeInboundDetail,
      transaction,
    });
    await OutboundModel.destroy({
      where: { id },
      transaction,
    });
    if (revertRefsIds.length) await OutboundRefModel.destroy({ where: { id: revertRefsIds }, transaction });

    await transaction.commit();
    req.flash('success', `Data Berhasil Di Hapus`);
    return res.redirect(`/outbound`);
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    req.flash('error', `Terjadi Kesalah pada server`);
    return res.redirect(`/outbound`);
  }
});

module.exports = router;
