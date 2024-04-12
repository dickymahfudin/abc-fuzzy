const express = require('express');

const router = express.Router();
const title = 'Login';

// const { rupiah } = require('../helpers/rupiah');

router.get('/', (req, res) => res.render('login', { title, layout: 'layouts/blank' }));

module.exports = router;
