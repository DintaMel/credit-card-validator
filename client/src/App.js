import React, { useState } from 'react';
import './App.css';

function App() {
  //TODO: add typescript
  // TODO: write tests

  const [isValid, setIsValid] = useState();
  const [creditCardNumber, setCreditCardNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedCreditCardNumber = creditCardNumber.replace(/[ ,-]/g, '');

    if (
      formattedCreditCardNumber.length < 12 ||
      formattedCreditCardNumber.length > 19
    ) {
      setIsValid(false);
      return;
    }

    await fetch('/credit-card-validity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'cc-number': formattedCreditCardNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsValid(data.isValid);
      });
  };

  return (
    <div className="App">
      <form
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        {/* <form method="post" onSubmit={handleSubmit}> */}
        <label htmlFor="cc-number">Credit Card Number: </label>
        <input
          type="text"
          id="credit-card"
          onChange={(event) => {
            setCreditCardNumber(event.target.value);
            setIsValid();
          }}
          autoComplete="cc-number"
          inputMode="numeric"
          name="cc-number"
          //credit cards range from 12-19 characters. Allowing max length up to 25 to account for spacing and dashes users may enter
          maxLength="25"
          minLength="12"
          //regex to only allow digits with spaces and dashes
          pattern="([0-9 \-]){12,25}"
          title="Credit card numbers must be between 12 and 19 digits long."
          value={creditCardNumber}
        />
        <input type="submit" value="Submit" />
      </form>
      {typeof isValid === 'boolean' && (
        <p>
          Credit card number {creditCardNumber} is{' '}
          <strong>{isValid ? 'valid' : 'invalid'}</strong>.
        </p>
      )}
    </div>
  );
}

export default App;
