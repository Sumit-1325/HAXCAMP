export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());

export const isPhone = (value) => /^[6-9]\d{9}$/.test(String(value).replace(/[\s-]/g, ''));

export const isPostalCode = (value) => /^\d{6}$/.test(String(value).trim());

export const isPositiveInt = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

export const isNonNegativeNumber = (value) =>
  value !== '' && !Number.isNaN(Number(value)) && Number(value) >= 0;

export const isHttpUrl = (value) => /^https?:\/\/\S+$/i.test(String(value).trim());

// Validated in the browser for fast feedback; the API validates everything
// again and is the only authority on what gets stored.
export const validateCheckout = (values) => {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Please enter your full name';
  else if (values.name.trim().length < 2) errors.name = 'That name looks too short';

  if (!values.email.trim()) errors.email = 'Please enter your email address';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address';

  if (!values.phone.trim()) errors.phone = 'Please enter your phone number';
  else if (!isPhone(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number';

  if (!values.line1.trim()) errors.line1 = 'Please enter your street address';
  if (!values.city.trim()) errors.city = 'Please enter your city';
  if (!values.state.trim()) errors.state = 'Please enter your state';

  if (!values.postalCode.trim()) errors.postalCode = 'Please enter your PIN code';
  else if (!isPostalCode(values.postalCode)) errors.postalCode = 'PIN code must be 6 digits';

  if (!values.country.trim()) errors.country = 'Please enter your country';

  return errors;
};

export const validateProduct = (values) => {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Product name is required';
  else if (values.name.trim().length < 3) errors.name = 'Name must be at least 3 characters';

  if (!values.category) errors.category = 'Choose a category';

  if (String(values.price).trim() === '') errors.price = 'Price is required';
  else if (!isNonNegativeNumber(values.price)) errors.price = 'Price must be a number of 0 or more';

  if (String(values.stock).trim() === '') errors.stock = 'Stock is required';
  else if (!Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) {
    errors.stock = 'Stock must be a whole number of 0 or more';
  }

  if (values.image.trim() && !isHttpUrl(values.image)) {
    errors.image = 'Enter a full image URL starting with http:// or https://';
  }

  if (values.description.length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters';
  }

  return errors;
};
