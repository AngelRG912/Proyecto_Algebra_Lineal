let matrix = []; // Inicializar la matriz como un array vacío

// Crear matriz visual en el contenedor HTML
function createMatrix() {
  const matrixContainer = document.getElementById("matrix-container");
  matrixContainer.innerHTML = ""; // Limpiar el contenedor

  // Crear una tabla para mejorar la visualización
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  matrix.forEach((row, rowIndex) => {
    const tr = document.createElement("tr"); // Crear una fila en la tabla
    row.forEach((cell, colIndex) => {
      // Crear una celda con un campo de entrada para cada elemento de la matriz
      const td = document.createElement("td");

      const input = document.createElement("input");
      input.type = "text"; // Cambiar a tipo texto para aceptar fracciones y números complejos
      input.value = cell; // Inicializar con el valor actual de la matriz
      input.style.width = "100px"; // Establecer un tamaño fijo para los inputs
      input.style.padding = "8px"; // Añadir espacio interno
      input.style.margin = "5px"; // Añadir margen para separación
      input.addEventListener("input", (e) => {
        const value = e.target.value;

        // Validar y convertir la entrada
        try {
          const parsedValue = math.evaluate(value); // Usar math.js para evaluar la entrada
          matrix[rowIndex][colIndex] = parsedValue; // Asignar el valor evaluado a la matriz
        } catch (error) {
          console.warn("Entrada no válida. Se ignorará.");
          // No actualizar la matriz si hay un error en la entrada
        }
      });

      td.appendChild(input); // Añadir el campo de entrada a la celda
      tr.appendChild(td); // Añadir la celda a la fila
    });
    tbody.appendChild(tr); // Añadir la fila al cuerpo de la tabla
  });

  table.appendChild(tbody); // Añadir el cuerpo a la tabla
  matrixContainer.appendChild(table); // Añadir la tabla al contenedor
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

// Inicializar con una fila
addRow();

// Función para leer archivo de texto y cargarlo en la matriz
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.name.endsWith(".txt")) {
      reader.onload = function (e) {
        const contenido = e.target.result;
        matrix = contenido
          .trim()
          .split("\n")
          .map((line) => line.split(",").map(Number));
        createMatrix(); // Actualizar la vista de la matriz
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".pdf")) {
      reader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;

        let textoCompleto = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const texto = await page.getTextContent();
          texto.items.forEach((item) => {
            textoCompleto += item.str + "\n";
          });
        }

        matrix = textoCompleto
          .trim()
          .split("\n")
          .map((line) => line.split(",").map(Number));
        createMatrix(); // Actualizar la vista de la matriz
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert(
        "Por favor, carga un archivo de texto (.txt) o un archivo PDF (.pdf)."
      );
    }
  });

function performOperation(operation) {
  switch (operation) {
    case "gauss-jordan":
      // Implementa el método de Gauss-Jordan aquí
      break;
    case "sel":
      // Resuelve el sistema de ecuaciones lineales aquí
      break;
    case "inverse":
      // Calcula la inversa de la matriz aquí
      break;
    case "determinant":
      // Calcula el determinante aquí
      break;
    case "gauss-jordan-human":
      // Implementa el Gauss-Jordan con pasos detallados aquí
      break;
    default:
      console.warn("Operación no reconocida");
  }
}

function copyResult() {
  const resultContainer = document.getElementById("results-container");
  const text = resultContainer.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Resultado copiado al portapapeles");
  });
}
