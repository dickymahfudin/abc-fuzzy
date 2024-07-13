const express = require('express');

const router = express.Router();
const { generateProduct, generateInbound, generateOutbound } = require('../helpers/dataLaporan');
const {
  ProductModel,
  InboundModel,
  InboundDetailModel,
  OutboundModel,
  OutboundDetailModel,
  OutboundRefModel,
} = require('../models');

router.get('/', (req, res) => res.render('setting', { title: 'Setting' }));

router.post('/reset', async (req, res) => {
  try {
    await ProductModel.destroy({ where: {} });
    await InboundModel.destroy({ where: {} });
    await InboundDetailModel.destroy({ where: {} });
    await OutboundModel.destroy({ where: {} });
    await OutboundDetailModel.destroy({ where: {} });
    await OutboundRefModel.destroy({ where: {} });

    await generateProduct();
    await generateInbound();
    await generateOutbound();

    res.status(200).send('Data telah direset menjadi laporan.');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat mereset data.');
  }
});

router.post('/hapus', async (req, res) => {
  try {
    await ProductModel.destroy({ where: {} });
    await InboundModel.destroy({ where: {} });
    await InboundDetailModel.destroy({ where: {} });
    await OutboundModel.destroy({ where: {} });
    await OutboundDetailModel.destroy({ where: {} });
    await OutboundRefModel.destroy({ where: {} });

    res.status(200).send('Semua data telah dihapus.');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat menghapus data.');
  }
});

module.exports = router;
