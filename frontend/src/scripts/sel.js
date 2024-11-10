let matrix = [];

// Función para inicializar una matriz 3x4 y renderizarla
function initializeMatrix3x3() {
  // Crear una matriz 3x4 llena de ceros
  matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

// Gauss-Jordan Functions (sin cambios en esta sección)
function hacer_Uno(matriz, fila, col, m) {
  const pivote = matriz[fila][col];
  if (Math.abs(pivote) > 1e-10) {
    // Evitar divisiones por valores muy pequeños
    for (let j = 0; j < m; j++) {
      matriz[fila][j] /= pivote;
    }
  }
}
function ceros_Abajo(matriz, fila, col, n, m) {
  for (let i = fila + 1; i < n; i++) {
    const factor = matriz[i][col];
    if (factor !== 0) {
      for (let j = 0; j < m; j++) {
        matriz[i][j] -= factor * matriz[fila][j];
      }
    }
  }
}

function ceros_Arriba(matriz, fila, col, m) {
  for (let i = fila - 1; i >= 0; i--) {
    const factor = matriz[i][col];
    if (factor !== 0) {
      for (let j = 0; j < m; j++) {
        matriz[i][j] -= factor * matriz[fila][j];
      }
    }
  }
}

function mostrarMatriz(matriz) {
  console.log("Matriz:");
  matriz.forEach((row) => console.log(row.join(" ")));
}

function cambia_Renglones(matriz, fila_actual) {
  const n = matriz.length;
  for (let i = fila_actual + 1; i < n; i++) {
    if (matriz[i][fila_actual] !== 0) {
      [matriz[fila_actual], matriz[i]] = [matriz[i], matriz[fila_actual]];
      console.log(`Intercambio de filas ${fila_actual + 1} y ${i + 1}:`);
      mostrarMatriz(matriz);
      break;
    }
  }
}

// Función para resolver el sistema usando el método de Gauss-Jordan y mostrar resultados
function resolverSistemaGaussJordan() {
  try {
    const n = matrix.length;
    const m = matrix[0].length;

    // Gauss-Jordan para escalonar la matriz
    for (let i = 0; i < n; i++) {
      if (Math.abs(matrix[i][i]) < 1e-10) {
        // Comprobar si el pivote es casi cero
        cambia_Renglones(matrix, i);
      }
      hacer_Uno(matrix, i, i, m);
      ceros_Abajo(matrix, i, i, n, m);
    }

    // Escalonar hacia arriba
    for (let i = n - 1; i >= 0; i--) {
      ceros_Arriba(matrix, i, i, m);
    }

    mostrarSolucion();
  } catch (error) {
    console.error("Error al resolver el sistema: ", error);
    document.getElementById("results-container").innerHTML =
      "Error en el cálculo. Revisa la matriz y vuelve a intentarlo.";
  }
}

function mostrarSolucion() {
  const solutionContainer = document.getElementById("results-container");
  solutionContainer.innerHTML = ""; // Limpiar el contenedor de resultados

  matrix.forEach((row, i) => {
    const result = document.createElement("div");
    result.classList.add("solution-result");

    // Obtener el resultado de la última columna para cada fila
    const decimalResult = row[matrix[0].length - 1];

    // Solo convertir a fracción si no es un número entero
    const displayValue = Number.isInteger(decimalResult)
      ? decimalResult
      : decimalToFraction(decimalResult);

    result.textContent = `x${i + 1} = ${displayValue}`;
    solutionContainer.appendChild(result);
  });
}

function decimalToFraction(decimal) {
  if (Number.isInteger(decimal)) return decimal.toString(); // Si es entero, solo mostrar el número

  const isNegative = decimal < 0; // Verificar si el decimal es negativo
  decimal = Math.abs(decimal); // Trabajar con el valor absoluto para simplificar

  const tolerance = 1.0e-6; // Tolerancia para la precisión de la fracción
  let numerator = 1;
  let denominator = 1;

  while (Math.abs(numerator / denominator - decimal) > tolerance) {
    if (numerator / denominator < decimal) {
      numerator++;
    } else {
      denominator++;
    }
  }

  // Agregar el signo negativo si el decimal original era negativo
  return isNegative
    ? `-${numerator}/${denominator}`
    : `${numerator}/${denominator}`;
}

function mostrarSolucion() {
  const solutionContainer = document.getElementById("results-container");
  solutionContainer.innerHTML = ""; // Limpiar el contenedor de resultados

  matrix.forEach((row, i) => {
    const result = document.createElement("div");
    result.classList.add("solution-result");
    const decimalResult = row[matrix[0].length - 1];
    result.textContent = `x${i + 1} = ${decimalToFraction(decimalResult)}`;
    solutionContainer.appendChild(result);
  });
}
