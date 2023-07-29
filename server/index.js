const express = require('express');
const cors = require('cors');
require('dotenv').config({path: './.env'});
const app = express();
const port = 8080;
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const createCheckoutSession = require('./api/checkout')

app.use(cors({origin: true}));
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/create-checkout-session', createCheckoutSession);

app.listen(port, () => console.log('server listening on port', port));