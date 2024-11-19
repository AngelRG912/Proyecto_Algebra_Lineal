export function isFraction(value) {
  const fractionRegex = /^-?\d+\/\d+$/;
  return fractionRegex.test(value);
}

export function fractionToString(value) {
  return value.toString();
}

export function stringToFraction(value) {
  const [numerator, denominator] = value.split("/").map(Number);
  if (denominator !== 0) {
    return numerator / denominator;
  }
  return 0; // Retorna 0 si el denominador es 0
}

export function decimalToFraction(decimal) {
  if (Number.isInteger(decimal)) return decimal.toString();

  const isNegative = decimal < 0;
  decimal = Math.abs(decimal);

  const tolerance = 1.0e-6;
  let numerator = 1;
  let denominator = 1;

  while (Math.abs(numerator / denominator - decimal) > tolerance) {
    if (numerator / denominator < decimal) {
      numerator++;
    } else {
      denominator++;
    }
  }

  // Si el denominador es 1, devuelve solo el numerador
  return isNegative
    ? `-${numerator}`
    : denominator === 1
    ? `${numerator}`
    : `${numerator}/${denominator}`;
}

export function showNotification(message, type = "success") {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const notification = document.createElement("div");
  notification.classList.add("notification", type);
  notification.textContent = message;
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}
