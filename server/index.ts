const express = require('express');
const { request: Req } = require('express');
const { response: Res } = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the Luhn algorithm to calculate check sum digit.
// If valid, this should be equal to the last number of the credit card number.
// Steps (per Wikipedia):
// 1) start from the rightmost digit. Moving left, double the value of every second digit (including the rightmost digit).
// 2) Sum the values of the resulting digits.
// 3) Use formula (10 - (sum mod 10)) mod 10
const calculateCheckDigit = (ccNumWithoutCheckSum: string): number => {
  // start with rightmost digit and move left
  const reversedNum = ccNumWithoutCheckSum.toString().split('').reverse();
  let sum = 0;

  reversedNum.forEach((digit: string, index: number) => {
    let value = Number(digit);

    // odd digits are not doubled
    if (index % 2 === 1) {
      sum += value;
      return;
    }

    // double the value of every second digit (including the rightmost digit)
    value = value * 2;

    // Sum the values of the resulting digits.
    if (value < 10) {
      sum += value;
      return;
    }
    const arrayOfDigits = value.toString().split('');

    arrayOfDigits.forEach((splitDigit) => {
      sum += Number(splitDigit);
    });
  });

  const calculatedCheckSum = (10 - (sum % 10)) % 10;
  return calculatedCheckSum;
};

app.post(
  '/credit-card-validity',
  (req: typeof Req, res: typeof Res): { isValid: boolean } => {
    // TODO: write tests?
    const body = req.body;

    if ('cc-number' in body == false) {
      return res.json({ isValid: false });
    }

    const creditCardNumber: string = req.body['cc-number'];

    if (Number.isNaN(Number(creditCardNumber))) {
      return res.json({ isValid: false });
    }

    const checkSumDigit = Number(creditCardNumber.slice(-1));
    const ccNumWithoutCheckSum: string = creditCardNumber.slice(0, -1);

    const calculatedCheckSum = calculateCheckDigit(ccNumWithoutCheckSum);

    // Compare your calculated check sum with the provided check digit. If both numbers match, the result is valid.
    const isValid = checkSumDigit === calculatedCheckSum;

    return res.json({ isValid: isValid });
  }
);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
