let matrix = [];

// Función para inicializar una matriz 3x4 y renderizarla
function initializeMatrix3x3() {
  // Crear una matriz 3x4 llena de ceros
  matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}

function hacer_Uno(matriz, fila, col, m) {
  const pivote = matriz[fila][col];
  if (pivote !== 0) {
    for (let j = 0; j < m; j++) {
      matriz[fila][j] /= pivote;
    }
  }
  return pivote;
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

function cambia_Renglones(matriz, fila_actual) {
  const n = matriz.length;
  for (let i = fila_actual + 1; i < n; i++) {
    if (matriz[i][fila_actual] !== 0) {
      [matriz[fila_actual], matriz[i]] = [matriz[i], matriz[fila_actual]];
      return -1;
    }
  }
  return 1;
}

function calcularDeterminante() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = ""; // Limpiar resultados anteriores

  const n = matrix.length;
  if (n !== matrix[0].length) {
    resultsContainer.innerHTML =
      "<p>La matriz no es cuadrada, no se puede calcular el determinante.</p>";
    return null;
  }

  let det = 1;
  const m = n;

  for (let i = 0; i < n; i++) {
    if (matrix[i][i] === 0) {
      det *= cambia_Renglones(matrix, i);
    }
    const pivote = hacer_Uno(matrix, i, i, m);
    det *= pivote;
    ceros_Abajo(matrix, i, i, n, m);
  }

  resultsContainer.innerHTML = `<p>El determinante de la matriz es: ${det}</p>`;
  return det;
}

// Inicializar la primera celda en la matriz para empezar
addRow();
