let matrix = []; // Inicializar la matriz como un array vacío

// Crear matriz visual en el contenedor HTML
function createMatrix() {
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get("titulo");
  var borderStyle = "5px";
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
      input.type = "text";
      input.value = cell;
      input.style.width = "100px";
      input.style.padding = "8px";
      input.style.margin = "5px";

      input.addEventListener("click", function () {
        this.select();
      });

      input.addEventListener("input", (e) => {
        try {
          const parsedValue = math.evaluate(e.target.value);
          matrix[rowIndex][colIndex] = parsedValue;
        } catch (error) {
          console.warn("Entrada no válida. Se ignorará.");
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
}

// Función para ajustar el tamaño de la matriz según el número de filas y columnas ingresados
function adjustMatrix() {
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
function addRow() {
  const cols = matrix[0]?.length || 1;
  const newRow = Array(cols).fill(0);
  matrix.push(newRow);
  createMatrix();
}

// Agregar una columna a la matriz
function addColumn() {
  if (matrix.length === 0) {
    matrix.push([0]);
  } else {
    matrix.forEach((row) => row.push(0));
  }
  createMatrix();
}

// Reiniciar la matriz
function resetMatrix() {
  matrix = [];
  addRow();
  createMatrix();
}

// Función para limpiar la matriz
function clearMatrix() {
  matrix = matrix.map((row) => row.map(() => 0)); // Establecer todos los valores en 0
  createMatrix(); // Actualizar la visualización de la matriz
}

// Inicializar con una fila
addRow();

// Función para leer archivo de texto y cargarlo en la matriz
// Función para leer archivo de texto y cargarlo en la matriz
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      alert("Por favor, carga un archivo de texto (.txt).");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;

      matrix = contenido
        .trim()
        .split("\n")
        .map((line) => line.split(",").map(Number));

      createMatrix();

      // Resetear el input de archivo después de leer el archivo
      document.getElementById("fileInput").value = "";
    };

    reader.readAsText(file);
  });

function copyResult() {
  const resultContainer = document.getElementById("results-container");
  const text = resultContainer.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Resultado copiado al portapapeles");
  });
}
