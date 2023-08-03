
const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const connectDB = require('./db/conn');
const routes = require('./routes/routes');
const user = require('./routes/user');
const product = require('./models/productModel');
const order = require('./models/orderModel');
const payment = require('./models/paymentModel');

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use('/api', routes);
app.use('/api', user);
app.use('/api', product);
app.use('/api', order);
app.use('/api', payment);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
