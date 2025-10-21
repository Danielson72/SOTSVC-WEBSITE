export function validatePhone(phone: string): boolean {
  return /^[\d\s\-\(\)]+$/.test(phone);
}

export function validateEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

export function validateForm(data: {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.serviceType) {
    errors.serviceType = 'Please select a service type';
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!data.preferredDate) {
    errors.preferredDate = 'Please select a preferred date';
  }

  if (!data.preferredTime) {
    errors.preferredTime = 'Please select a preferred time';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}