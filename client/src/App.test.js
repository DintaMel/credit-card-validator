import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders credit card number form', () => {
  render(<App />);
  const creditCardNumber = screen.getByText('Credit Card Number:');
  expect(creditCardNumber).toBeInTheDocument();
});

// TODO: other tests to write
//  error when submitting with letters

// mock response for submitting when 12 digit number is entered

// test that -----------12-21 should return false since less than 12 digits

// verify it shows error when the api post fails
