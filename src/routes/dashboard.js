const express = require('express');
const { literal, fn, col, Op } = require('sequelize');
const moment = require('moment');

const { ProductModel, InboundModel, OutboundDetailModel, OutboundRefModel, OutboundModel } = require('../models'); // Pastikan path ini benar

const router = express.Router();
const title = 'Dashboard';

router.get('/', async (req, res) => {
  const { startDate, endDate } = req.query;

  const whereCondition = {};
  if (startDate && endDate) {
    whereCondition.transactionDate = {
      [Op.between]: [
        moment(startDate, 'DD-MM-YYYY').startOf('date').toDate(),
        moment(endDate, 'DD-MM-YYYY').endOf('date').toDate(),
      ],
    };
  }

  const totalInbound = (await InboundModel.sum('totalPrice', { where: whereCondition })) || 0;
  const totalSales = await OutboundRefModel.findOne({
    attributes: [
      [fn('sum', literal('OutboundRef.amount * OutboundRef.currentPrice')), 'revenue'],
      [fn('sum', literal('OutboundRef.amount * (OutboundRef.currentPrice - OutboundRef.buyPrice)')), 'laba'],
    ],
    include: [
      {
        model: OutboundDetailModel,
        as: 'outboundDetail',
        attributes: [],
        include: [
          {
            model: OutboundModel,
            as: 'outbound',
            attributes: [],
            where: whereCondition,
          },
        ],
        required: true,
      },
    ],
    raw: true,
  });

  const productSales = await OutboundDetailModel.findAll({
    attributes: ['productId', [fn('SUM', col('amount')), 'totalSold']],
    group: ['productId'],
    include: [
      { model: ProductModel, as: 'product' },
      { model: OutboundModel, as: 'outbound', attributes: [], where: whereCondition },
    ],
    order: [['productId', 'ASC']],
  });

  res.render('dashboard', {
    title,
    cardInfo: [
      {
        title: 'Total Pendapatan',
        value: parseInt(totalSales?.revenue ?? 0, 10).toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }),
      },
      {
        title: 'Total Pengeluaran',
        value: totalInbound.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }),
      },
      {
        title: 'Laba',
        value: parseInt(totalSales?.laba ?? 0, 10).toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }),
      },
    ],
    productSales: productSales.map(sale => ({
      name: sale.product.name,
      totalSold: sale.get('totalSold'),
    })),
  });
});

module.exports = router;
