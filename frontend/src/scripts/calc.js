let matrix = []; // Inicializar la matriz como un array vacío
let borderStyle = "5px";
let isInverseOperation = false;

// Función para calcular y mostrar el resultado
function calculateMatrix() {
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get("titulo");
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  let result;
  try {
    switch (titulo) {
      case "Algoritmo Gauss-Jordan":
        try {
          result = gaussJordan([...matrix]);
          displayResult(result);
          showNotification("Algoritmo Gauss-Jordan completado", result); // Notificación de éxito
        } catch (error) {
          resultsContainer.textContent = "Error en el Algoritmo Gauss-Jordan.";
          showNotification("Error en el Algoritmo Gauss-Jordan", "error"); // Notificación de error
        }
        break;

      case "Determinante":
        try {
          // Verificar si la matriz es cuadrada antes de calcular el determinante
          if (matrix.length !== matrix[0].length) {
            throw new Error("La matriz no es cuadrada");
          }
          result = calculateDeterminant(matrix);
          resultsContainer.textContent = `Determinante: ${result.toFixed(2)}`;
          showNotification(
            `Determinante calculado: ${result.toFixed(2)}`,
            null
          ); // Notificación de éxito
        } catch (error) {
          if (error.message === "La matriz no es cuadrada") {
            resultsContainer.textContent =
              "La matriz no es cuadrada. No se puede calcular el determinante.";
            showNotification("La matriz no es cuadrada", "error"); // Notificación de error
          } else {
            resultsContainer.textContent =
              "Error en el cálculo del determinante.";
            showNotification(
              "Error en el cálculo del determinante",
              null,
              "error"
            ); // Notificación de error
          }
        }
        break;

      case "Matriz Inversa":
        try {
          result = calculateInverse(matrix);
          displayResult(result, "Matriz Inversa Calculada"); // Mostrar la inversa
          showNotification("Matriz inversa calculada", result); // Notificación de éxito
        } catch (error) {
          if (error.message === "La matriz es singular y no tiene inversa.") {
            resultsContainer.textContent =
              "La matriz es singular y no tiene inversa.";
            showNotification("La matriz no tiene inversa", "error"); // Notificación de error
          } else {
            resultsContainer.textContent =
              "Error en el cálculo de la matriz inversa.";
            showNotification(
              "Error en el cálculo de la matriz inversa",
              "error"
            ); // Notificación de error
          }
        }
        break;

      default:
        resultsContainer.textContent = "Seleccione una operación válida.";
        showNotification("Operación no válida", "error"); // Notificación de error
    }
  } catch (error) {
    // General error handler
    resultsContainer.textContent = "Error en la operación solicitada.";
    showNotification("Error en la operación", null); // Notificación de error
  }
}

// Función para mostrar resultados en formato tabla
function displayResult(resultMatrix, title = "Resultado:") {
  const resultsContainer = document.getElementById("results-container");

  // Crear la tabla para mostrar el resultado
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  // Título para la matriz
  const titleRow = document.createElement("tr");
  const titleCell = document.createElement("td");
  titleCell.colSpan = resultMatrix[0].length;
  titleCell.style.textAlign = "center";
  titleCell.style.fontWeight = "bold";
  titleCell.textContent = title;
  titleCell.style.background = "none";
  titleCell.style.border = "none";
  titleRow.appendChild(titleCell);
  tbody.appendChild(titleRow);

  // Rellenar la tabla con los valores de la matriz en formato de fracción
  resultMatrix.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");

      // Convertir el valor a fracción y mostrarlo en la celda
      td.textContent = decimalToFraction(cell);
      td.style.width = "90px";
      td.style.padding = "8px";
      td.style.textAlign = "center";
      td.style.border = "1px solid #9d9d9d79";
      td.style.whiteSpace = "nowrap";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  // Aplicar estilos a la tabla
  table.style.borderRadius = "8px";
  table.style.padding = "10px";
  table.style.fontSize = "1.2em";
  table.style.overflowX = "auto";

  // Limpiar el contenedor antes de añadir la nueva tabla
  resultsContainer.innerHTML = "";
  resultsContainer.appendChild(table);
}

// Función para leer el archivo .txt y convertirlo a una matriz separada por comas
function readFileAndUpdateMatrix(event) {
  const file = event.target.files[0]; // Obtener el archivo seleccionado
  if (!file) return; // Si no se selecciona archivo, salir

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result; // Obtener el contenido del archivo
    const rows = content.trim().split("\n"); // Dividir el contenido en filas

    matrix = rows.map((row) => {
      // Para cada fila, dividir por comas
      return row
        .trim()
        .split(",")
        .map((cell) => {
          // Detectar si la celda es una fracción
          if (cell.includes("/")) {
            // Si es una fracción, convertirla a número
            const [numerator, denominator] = cell.split("/").map(Number);
            return denominator !== 0 ? numerator / denominator : 0; // Evitar divisiones por cero
          } else {
            // Si no es una fracción, convertir a número normal
            const parsedValue = parseFloat(cell);
            return isNaN(parsedValue) ? 0 : parsedValue; // Si no es un número, colocar 0
          }
        });
    });
    deleteResult();
    createMatrix(); // Volver a renderizar la matriz

    // Resetear el input de archivo para permitir la carga de un archivo igual
    event.target.value = ""; // Esto permite volver a cargar el mismo archivo
  };

  reader.readAsText(file); // Leer el archivo como texto
}

// Agregar el event listener para manejar la carga de archivo
document
  .getElementById("fileInput")
  .addEventListener("change", readFileAndUpdateMatrix);

// Función para copiar al portapapeles
function copyResult() {
  const resultContainer = document.getElementById("results-container");
  if (resultContainer) {
    const rows = Array.from(resultContainer.querySelectorAll("tr"));
    let tableText = "";

    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td, th"));
      const rowText = cells.map((cell) => cell.textContent.trim()).join("\t");
      tableText += rowText + "\n";
    });

    if (tableText.trim()) {
      navigator.clipboard.writeText(tableText.trim()).then(
        () => {
          showNotification("Tabla copiada al portapapeles!", "success");
        },
        (err) => {
          showNotification("Error al copiar la tabla.", "error");
          console.error("Error al copiar al portapapeles: ", err);
        }
      );
    } else {
      showNotification("No hay resultados para copiar.", "error");
    }
  } else {
    showNotification("No se encontró el contenedor de resultados.", "error");
  }
}

// Función para borrar resultados
function deleteResult() {
  // Obtener el contenedor de resultados
  const resultsContainer = document.getElementById("results-container");

  // Limpiar los resultados si existen
  if (resultsContainer) {
    resultsContainer.innerHTML = "";
    showNotification("Resultado borrado correctamente.", "success");
  } else {
    showNotification("No hay resultados para borrar.", "error");
  }
}

// Inicializar con una fila
addRow();
