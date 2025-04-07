export const formatPrice = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "";
  
    if (number % 1 === 0) {
      return new Intl.NumberFormat("ru-RU").format(number);
    } else {
      return new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
        .format(number)
        .replace(",", ".");
    }
  };