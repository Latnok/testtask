const express = require('express');
const path = require('path');
const axios = require('axios');
const _ = require('underscore');
const bodyParser = require('body-parser')
const cors = require('cors')
const yup = require('yup')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', (req, res) => {
  return res.send('pong');
});

var products = []

var totals = {
  'RUB':0,
  'USD':0,
  'EUR':0
}

const schema = yup.array().of(
  yup.object({
   name: yup.string()
     .min(1, 'Must be 1 character or more')
     .required('Required'),
   quantity: yup.number()
     .positive('Only positive')
     .integer('Only integer')
     .required('Required'),
   price: yup.number()
     .positive('Only positive')
     .required('Required'),
   currency: yup.mixed()
     .oneOf(['RUB', 'USD', 'EUR'])
     .required('Required'),
}));

app.post('/api/calc', async (req, res) =>  {
  var totalRubbles = 0;
  schema.validate(
    _.compact(req.body)
  ).then((validated) => {
    products = validated;
  }).catch((error) => {
    console.log(error);
    return error;
  });
  await axios.get('https://www.cbr-xml-daily.ru/daily_json.js')
  .then(response => {
    if (response.status !== 200)
      return {error:'response status !== 200', status:response.status}
    response.data.Valute['RUB'] = {Value:1}
    products = _.groupBy(products, (product) => {return product.currency});
    _.each(totals, (value, currency)=> {
      _.each(products[currency], (product) => {
        totalRubbles += product.price * product.quantity * response.data.Valute[currency].Value;
      })
    });
    _.each(totals, (value, currency)=> {
      totals[currency] = totalRubbles / response.data.Valute[currency].Value
    });
  }).catch((error) => {
    console.log(error);
    return error;
  });
  return res.send(totals);
});

app.listen(process.env.PORT || 8080);
