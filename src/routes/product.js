const express = require('express');
const { Op } = require('sequelize');
const { ProductModel } = require('../models');
const generateTable = require('../helpers/generateTable');

const router = express.Router();
const title = 'Product';
const path = 'product';

router.get('/', (req, res) => res.render(`${path}/index`, { title }));

router.post('/', async (req, res) => {
  const { sku, name, buyPrice, currentPrice } = req.body;
  const findProduct = await ProductModel.findOne({ where: { [Op.or]: [{ sku }, { name }] } });

  if (findProduct) {
    const duplicate =
      sku === findProduct.sku && name === findProduct.name
        ? 'Nomor Barang dan Nama'
        : name === findProduct.name
          ? 'Nama'
          : 'Nomor Barang';
    req.flash('error', `${duplicate} Tidak Boleh Sama`);

    return res.render(`${path}/form`, { title, action: `/${path}`, product: { sku, name, buyPrice, currentPrice } });
  }
  await ProductModel.create({ sku, name, buyPrice, currentPrice });
  req.flash('success', 'Data Berhasil Ditambahkan');
  return res.redirect(`/${path}`);
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { sku, name, buyPrice, currentPrice } = req.body;

  const findProduct = await ProductModel.findByPk(id);
  if (!findProduct) {
    req.flash('error', `Data Tidak ditemukkan`);
    return res.redirect(`/${path}`);
  }
  await findProduct.update({ sku, name, buyPrice, currentPrice });
  req.flash('success', 'Data Berhasil Diubah');
  return res.redirect(`/${path}`);
});

router.get('/form', (req, res) => res.render(`${path}/form`, { title, action: `/${path}`, product: {} }));

router.get('/form/:id', async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findByPk(id);
  if (!product) {
    req.flash('error', `Data Tidak ditemukkan`);
    return res.redirect(`/${path}`);
  }
  return res.render(`${path}/form`, { title, action: `/${path}/${id}`, product });
});

router.get('/table', async (req, res) => res.json(await generateTable({ req: req.query, model: ProductModel })));

module.exports = router;
