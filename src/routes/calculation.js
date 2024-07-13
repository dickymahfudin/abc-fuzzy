const express = require('express');
const calculation = require('../helpers/calculation');

const router = express.Router();
const title = 'Calculation';
const path = 'calculation';

router.get('/', async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);
  const data = await calculation(startDate, endDate);
  // res.json(data);
  res.render(`${path}/index`, { title, data });
});

module.exports = router;
