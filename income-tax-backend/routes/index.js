var express = require('express');
var router = express.Router();
var moment = require('moment');

const taxBracket = [
  { initialAmount: 0, lastAmount: 18200, fixed: 0, rate: 0 },
  { initialAmount: 18201, lastAmount: 37000, fixed: 0, rate: 19 },
  { initialAmount: 37001, lastAmount: 87000, fixed: 3572, rate: 32.5 },
  { initialAmount: 87001, lastAmount: 180000, fixed: 19822, rate: 35 },
  { initialAmount: 180001, lastAmount: null, fixed: 54232, rate: 45 },
]

/* GET home page. */
router.post('/', (req, res, next) => {
  console.log(req.body);

  const userInfo = req.body;
  let start = new Date(req.body.paymentStartDate);
  let grossIncome = Math.round(userInfo.annualSalary / 12);
  const incomeTaxFunction = (gross, startDate) => {
    let start = new Date(startDate);
    console.log(start);

    const endYear = (start.getMonth() > 2 ? (start.getFullYear() + 1) : start.getFullYear());
    let totalMonth = moment([endYear, 2, 31]).diff(moment([start.getFullYear(), start.getMonth(), start.getDate()]), 'months', true);
    taxableAmount = gross * totalMonth;
    console.log(totalMonth,taxableAmount);
    for (const list of taxBracket) {
      if (list.initialAmount <= taxableAmount && (taxableAmount <= list.lastAmount || list.lastAmount == null)) {
        let amount = list.fixed + ((taxableAmount - list.initialAmount) * list.rate) / 100;
        return amount;
      }
    }
  }
  let incomeTax = Math.round(incomeTaxFunction(grossIncome, req.body.paymentStartDate)/12);
  let netIncome = grossIncome - incomeTax;
  let superAmount = Math.round((grossIncome * userInfo.superRate) / 100);
  let payload = {
    name: userInfo.firstName + ' ' + userInfo.lastName,
    payPeriod: req.body.paymentStartDate + ' - ' + (start.getMonth() > 2 ? (start.getFullYear() + 1) : start.getFullYear()) + '-31-03',
    grossIncome,
    netIncome,
    incomeTax,
    superAmount
  };
  res.send(payload);
});



module.exports = router;
