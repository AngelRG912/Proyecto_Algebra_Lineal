// Función para crear una matriz de entradas
function createMatrixInputs(size) {
  const matrixContainer = document.getElementById("matrix-inputs");
  matrixContainer.innerHTML = ""; // Limpiar el contenedor
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.placeholder = `M[${i + 1}][${j + 1}]`;
      input.className = "matrix-input";
      matrixContainer.appendChild(input);
    }
    matrixContainer.appendChild(document.createElement("br"));
  }
}

// Función para obtener los valores de la matriz desde los inputs
function getMatrixValues(size) {
  const inputs = document.querySelectorAll(".matrix-inputs input");
  const matrix = [];
  inputs.forEach((input, index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    if (!matrix[row]) matrix[row] = [];
    matrix[row][col] = Number(input.value) || 0; // Convertir a número
  });
  return matrix;
}

// Función para ejecutar el algoritmo de Gauss-Jordan
function gaussJordan(matrix) {
  // Lógica de Gauss-Jordan. Esto es un esqueleto; debes implementar el algoritmo completo
  // Aquí podrías añadir los pasos del algoritmo para transformar la matriz
  return matrix; // Devolver la matriz (cambiada según el algoritmo)
}

// Función para mostrar el resultado en la interfaz
function displayResult(result) {
  const resultContainer = document.getElementById("result");
  resultContainer.textContent = "Resultado: " + JSON.stringify(result);
}

// Manejo de eventos
document.addEventListener("DOMContentLoaded", () => {
  const matrixSize = 3; // Tamaño de la matriz (3x3)
  createMatrixInputs(matrixSize);

  document.querySelector(".calculate").addEventListener("click", () => {
    const matrix = getMatrixValues(matrixSize);
    const result = gaussJordan(matrix); // Aplicar el método de Gauss-Jordan
    displayResult(result);
  });

  document.querySelector(".clear").addEventListener("click", () => {
    document
      .querySelectorAll(".matrix-inputs input")
      .forEach((input) => (input.value = ""));
    document.getElementById("result").textContent = "Resultado: -";
  });
});
