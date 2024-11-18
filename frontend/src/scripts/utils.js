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

// Convertir una fracción a formato de texto (por ejemplo, "1/2")
export function fractionToString(value) {
  return value.toString();
}

// Función para verificar si un valor es una fracción
export function isFraction(value) {
  const fractionRegex = /^-?\d+\/\d+$/;
  return fractionRegex.test(value);
}
