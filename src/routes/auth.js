const express = require('express');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models');

const router = express.Router();
const title = 'Login';

// const { rupiah } = require('../helpers/rupiah');

router.get('/', (req, res) => res.render('login', { title, layout: 'layouts/blank' }));

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  console.log({ username });
  const tempUser = await UserModel.findOne({ where: { username } });
  if (!tempUser) {
    req.flash('error', 'Username atau Password Salah');
    return res.redirect('/auth');
  }
  const isValidPassword = await bcrypt.compare(password, tempUser.password);
  if (!isValidPassword) {
    req.flash('error', 'Username atau Password Salah');
    return res.redirect('/auth');
  }
  req.flash('success', 'Login Berhasil');
  req.session.login = true;
  return res.redirect('/');
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    console.log(err);
  });
  res.redirect('/auth');
});

module.exports = router;
