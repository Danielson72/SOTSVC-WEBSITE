const CARD_PATTERNS = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
};

export function validateCard(number: string): boolean {
  // Remove spaces and dashes
  number = number.replace(/[\s-]/g, '');
  
  // Check if the card number matches any known pattern
  return Object.values(CARD_PATTERNS).some(pattern => pattern.test(number));
}

export function validateExpiryDate(month: string, year: string): boolean {
  const currentDate = new Date();
  const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
  
  return expiryDate > currentDate;
}

export function validateCVV(cvv: string): boolean {
  // CVV should be 3 or 4 digits
  return /^[0-9]{3,4}$/.test(cvv);
}