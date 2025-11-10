export const formatINR = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0));
  } catch {
    return `₹${Number(value || 0).toFixed(2)}`;
  }
};

export const formatDateIST = (value, options = {}) => {
  try {
    const date = value instanceof Date ? value : new Date(value);
    const fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    });
    return fmt.format(date);
  } catch {
    return '';
  }
};
