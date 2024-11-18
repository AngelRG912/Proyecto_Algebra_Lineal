let matrix = [];

function initializeMatrix3x3() {
  matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}

function hacer_Uno(matriz, identidad, fila, col, m) {
  const pivote = matriz[fila][col];
  if (pivote !== 0) {
    for (let j = 0; j < m; j++) {
      matriz[fila][j] /= pivote;
      identidad[fila][j] /= pivote;
    }
  }
}

function ceros_Abajo(matriz, identidad, fila, col, n, m) {
  for (let i = fila + 1; i < n; i++) {
    const factor = matriz[i][col];
    if (factor !== 0) {
      for (let j = 0; j < m; j++) {
        matriz[i][j] -= factor * matriz[fila][j];
        identidad[i][j] -= factor * identidad[fila][j];
      }
    }
  }
}

function ceros_Arriba(matriz, identidad, fila, col, m) {
  for (let i = fila - 1; i >= 0; i--) {
    const factor = matriz[i][col];
    if (factor !== 0) {
      for (let j = 0; j < m; j++) {
        matriz[i][j] -= factor * matriz[fila][j];
        identidad[i][j] -= factor * identidad[fila][j];
      }
    }
  }
}

function cambia_Renglones(matriz, identidad, fila_actual) {
  const n = matriz.length;
  for (let i = fila_actual + 1; i < n; i++) {
    if (matriz[i][fila_actual] !== 0) {
      [matriz[fila_actual], matriz[i]] = [matriz[i], matriz[fila_actual]];
      [identidad[fila_actual], identidad[i]] = [
        identidad[i],
        identidad[fila_actual],
      ];
      break;
    }
  }
}

function inicializarMatrizIdentidad(n) {
  matrizIdentidda = Array.from({ length: n }, (_, i) => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    matrizIdentidda[i][i] = 1;
  }
}

function mostrarMatrizEnHTML(matriz, containerId, decimalPlaces = 2) {
  const container = document.getElementById(containerId);
  const fragment = document.createDocumentFragment();

  matriz.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("matrix-row");
    row.forEach((val) => {
      const cell = document.createElement("span");
      cell.textContent = val.toFixed(decimalPlaces);
      cell.classList.add("input-matrix");
      rowDiv.appendChild(cell);
    });
    fragment.appendChild(rowDiv);
  });

  container.appendChild(fragment);
}

function calcularInversa() {
  const n = matrix.length;
  if (n !== matrix[0].length) {
    document.getElementById("result-container").innerHTML =
      "<p>La matriz no es cuadrada, no se puede calcular la inversa.</p>";
    return;
  }

  inicializarMatrizIdentidad(n);
  const m = n;

  for (let i = 0; i < n; i++) {
    if (matrix[i][i] === 0) {
      cambia_Renglones(matrix, matrizIdentidda, i);
    }
    hacer_Uno(matrix, matrizIdentidda, i, i, m);
    ceros_Abajo(matrix, matrizIdentidda, i, i, n, m);
  }

  for (let i = n - 1; i >= 0; i--) {
    ceros_Arriba(matrix, matrizIdentidda, i, i, m);
  }

  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "<h3>Matriz Original:</h3>";
  mostrarMatrizEnHTML(matrix, "result-container");

  const inverseTitle = document.createElement("h3");
  inverseTitle.textContent = "Matriz Inversa:";
  resultContainer.appendChild(inverseTitle);

  mostrarMatrizEnHTML(matrizIdentidda, "result-container");
}

addRow();
