/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('express-flash');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const middleware = require('./src/helpers/middleware');
const authRouter = require('./src/routes/auth');
const productRouter = require('./src/routes/product');
const inboundRouter = require('./src/routes/inbound');
const outboundRouter = require('./src/routes/outbound');
const calculationRouter = require('./src/routes/calculation');
const dashboardRouter = require('./src/routes/dashboard');
const settingRouter = require('./src/routes/setting');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 90000000 },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret',
  }),
);
app.use(flash());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
app.set('layout', './layouts/index');

app.use('/auth', authRouter);
app.use(middleware);
app.use('/', dashboardRouter);
app.use('/product', productRouter);
app.use('/inbound', inboundRouter);
app.use('/outbound', outboundRouter);
app.use('/calculation', calculationRouter);
app.use('/setting', settingRouter);

app.use('*', (req, res) => res.render('error', { title: '404', layout: 'layouts/blank' }));

app.listen(PORT, () => console.info(`Server Running on : http://localhost:${PORT}`));
