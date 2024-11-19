// Crear matriz visual en el contenedor HTML
export function createMatrix() {
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get("titulo");

  // Actualizar el valor de isInverseOperation
  isInverseOperation = titulo === "Matriz Inversa";

  const matrixContainer = document.getElementById("matrix-container");
  matrixContainer.innerHTML = ""; // Limpiar el contenedor

  // Crear una tabla para mejorar la visualización
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  matrix.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell, colIndex) => {
      const td = document.createElement("td");

      const input = document.createElement("input");
      //input.type = "text";
      input.type = "number";
      input.style.width = "100px";
      input.style.padding = "8px";
      input.style.margin = "5px";

      // Convertir a fracción si es necesario
      input.value = isFraction(cell) ? fractionToString(cell) : cell;

      input.addEventListener("click", function () {
        this.select();
      });

      input.addEventListener("input", (e) => {
        const inputValue = e.target.value;

        // Verificar si el valor ingresado es una fracción o un número decimal
        if (isFraction(inputValue)) {
          const parsedFraction = stringToFraction(inputValue);
          matrix[rowIndex][colIndex] = parsedFraction;
        } else if (!isNaN(inputValue)) {
          const parsedValue = parseFloat(inputValue);
          matrix[rowIndex][colIndex] = parsedValue;
        } else {
          matrix[rowIndex][colIndex] = 0; // Si la entrada no es válida, asigna 0
        }
      });

      td.appendChild(input);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  matrixContainer.appendChild(table);

  switch (titulo) {
    case "Algoritmo Gauss-Jordan":
      break;
    case "Sistema de Ecuaciones Líneales":
      table.style.border = "none";
      break;
    case "Matriz Inversa":
      break;
    case "Determinante":
      borderStyle = "0px";
      break;
    case "Gauss-Jordan-humanizado":
      break;
  }
  table.style.borderRadius = borderStyle;
  table.style.overflow = "auto";
}

// Ajustar el tamaño de la matriz
export function adjustMatrix() {
  const numRows = parseInt(document.getElementById("numRows").value);
  const numCols = parseInt(document.getElementById("numCols").value);

  matrix = Array.from({ length: numRows }, (_, rowIndex) =>
    Array.from(
      { length: numCols },
      (_, colIndex) => matrix[rowIndex]?.[colIndex] ?? 0
    )
  );

  createMatrix();
}

// Agregar una fila a la matriz
export function addRow() {
  const cols = matrix[0]?.length || 1;
  const newRow = Array(cols).fill(0);
  matrix.push(newRow);

  if (isInverseOperation && matrix.length !== matrix[0].length) {
    addColumn(); // Añade una columna adicional para mantener la matriz cuadrada
  }

  createMatrix();
}

// Agregar una Columna a la matriz
export function addColumn() {
  if (matrix.length === 0) {
    matrix.push([0]);
  } else {
    matrix.forEach((row) => row.push(0));
  }

  if (isInverseOperation && matrix[0].length !== matrix.length) {
    addRow(); // Añade una fila adicional para mantener la matriz cuadrada
  }

  createMatrix();
}

// Reiniciar la matriz
export function resetMatrix() {
  matrix = [];
  addRow();
  deleteResult();
  createMatrix();

  // Resetear el input de archivo para permitir la carga de un archivo igual
  document.getElementById("fileInput").value = ""; // Esto permite volver a cargar el mismo archivo
}

// Función para limpiar la matriz
export function clearMatrix() {
  matrix = matrix.map((row) => row.map(() => 0)); // Establecer todos los valores en 0
  createMatrix(); // Actualizar la visualización de la matriz
}
