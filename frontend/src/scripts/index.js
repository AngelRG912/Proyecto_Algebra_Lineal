let matrix = []; // Inicializar la matriz como un array vacío

function createMatrix() {
  const matrixContainer = document.getElementById("matrix-container");
  matrixContainer.innerHTML = ""; // Limpiar el contenedor

  matrix.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      // Crear un campo de entrada para cada elemento de la matriz
      const input = document.createElement("input");
      input.type = "number";
      input.value = matrix[rowIndex][colIndex] || ""; // Asignar el valor de la matriz
      input.addEventListener("input", (e) => {
        matrix[rowIndex][colIndex] = parseFloat(e.target.value);
      });
      matrixContainer.appendChild(input);
    });
  });

  // Ajustar el estilo de cuadrícula para que se adapte al tamaño actual de la matriz
  if (matrix[0]) {
    matrixContainer.style.gridTemplateColumns = `repeat(${matrix[0].length}, 80px)`; // Ajusta el tamaño de las columnas
  }
}

function addRow() {
  const cols = matrix[0]?.length || 1; // Número de columnas actual o 1 si la matriz está vacía
  const newRow = Array(cols).fill(0); // Crear una nueva fila con valores predeterminados (0)
  matrix.push(newRow); // Agregar la nueva fila a la matriz
  createMatrix(); // Actualizar la vista de la matriz
}

function addColumn() {
  if (matrix.length === 0) {
    matrix.push([0]); // Si la matriz está vacía, agrega la primera celda
  } else {
    matrix.forEach((row) => row.push(0)); // Agrega una nueva columna con valores 0
  }
  createMatrix(); // Actualizar la vista de la matriz
}

function resetMatrix() {
  matrix = []; // Reiniciar la matriz
  createMatrix(); // Actualizar la vista de la matriz
}

// Inicializar la primera celda en la matriz para empezar
addRow();