let matrix = []; // Inicializar la matriz como un array vacío
let borderStyle = "5px";

// Crear matriz visual en el contenedor HTML
function createMatrix() {
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get("titulo");

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

// Función para verificar si un valor es una fracción
function isFraction(value) {
  const fractionRegex = /^-?\d+\/\d+$/;
  return fractionRegex.test(value);
}

// Convertir una fracción a formato de texto (por ejemplo, "1/2")
function fractionToString(value) {
  return value.toString();
}

// Convertir una fracción en formato de texto a un valor numérico
function stringToFraction(value) {
  const [numerator, denominator] = value.split("/").map(Number);
  if (denominator !== 0) {
    return numerator / denominator;
  }
  return 0; // Retorna 0 si el denominador es 0
}

// Ajustar el tamaño de la matriz
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
  deleteResult();
  createMatrix();

  // Resetear el input de archivo para permitir la carga de un archivo igual
  document.getElementById("fileInput").value = ""; // Esto permite volver a cargar el mismo archivo
}

// Función para limpiar la matriz
function clearMatrix() {
  matrix = matrix.map((row) => row.map(() => 0)); // Establecer todos los valores en 0
  createMatrix(); // Actualizar la visualización de la matriz
}

// Función para resolver con Gauss-Jordan
function gaussJordan(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  // Hacer una copia de la matriz para no modificar la original
  let augmentedMatrix = matrix.map((row) => [...row]);

  // Aplicar el algoritmo de Gauss-Jordan
  for (let i = 0; i < numRows; i++) {
    // Encuentra el pivote (el valor más grande en la columna actual)
    let maxRow = i;
    for (let j = i + 1; j < numRows; j++) {
      if (
        Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])
      ) {
        maxRow = j;
      }
    }

    // Si el pivote es 0, la matriz es singular
    if (augmentedMatrix[maxRow][i] === 0) {
      showNotification(
        "La matriz es singular y no tiene solución única.",
        "error"
      );
      return augmentedMatrix; // No tiene solución única o tiene soluciones infinitas
    }

    // Intercambiar la fila actual con la fila del pivote
    if (maxRow !== i) {
      [augmentedMatrix[i], augmentedMatrix[maxRow]] = [
        augmentedMatrix[maxRow],
        augmentedMatrix[i],
      ];
    }

    // Normalizar el pivote
    const pivot = augmentedMatrix[i][i];
    for (let j = 0; j < numCols; j++) {
      augmentedMatrix[i][j] /= pivot;
    }

    // Hacer ceros en todas las posiciones de la columna i
    for (let k = 0; k < numRows; k++) {
      if (k !== i) {
        const factor = augmentedMatrix[k][i];
        for (let j = 0; j < numCols; j++) {
          augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
        }
      }
    }
  }

  return augmentedMatrix;
}

// Función para calcular el determinante
function calculateDeterminant(matrix) {
  // Verificar si la matriz es cuadrada
  if (matrix.length === matrix[0].length) {
    // Calcular el determinante usando math.js
    return math.det(matrix);
  }
}

// Función para generar la matriz identidad
function createIdentityMatrix(size) {
  const identityMatrix = [];
  for (let i = 0; i < size; i++) {
    const row = Array(size).fill(0);
    row[i] = 1;
    identityMatrix.push(row);
  }
  return identityMatrix;
}

// Función para calcular la inversa
function calculateInverse(matrix) {
  if (matrix.length !== matrix[0].length) {
    throw new Error("La matriz no es cuadrada");
  }

  // Verificar el determinante de la matriz
  const determinant = calculateDeterminant(matrix);
  if (determinant === 0) {
    throw new Error("La matriz es singular y no tiene inversa.");
  }

  // Crear la matriz identidad para mostrarla
  const identityMatrix = createIdentityMatrix(matrix.length);

  // Mostrar la matriz identidad antes de la inversa
  displayResult(identityMatrix, "Matriz Identidad");

  // Calcular la inversa usando math.js
  return math.inv(matrix);
}

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
          showNotification("Error en el Algoritmo Gauss-Jordan", null); // Notificación de error
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
            showNotification("La matriz no es cuadrada", null); // Notificación de error
          } else {
            resultsContainer.textContent =
              "Error en el cálculo del determinante.";
            showNotification("Error en el cálculo del determinante", null); // Notificación de error
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
            showNotification("La matriz no tiene inversa", null); // Notificación de error
          } else {
            resultsContainer.textContent =
              "Error en el cálculo de la matriz inversa.";
            showNotification("Error en el cálculo de la matriz inversa", null); // Notificación de error
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

    createMatrix(); // Volver a renderizar la matriz

    // Resetear el input de archivo para permitir la carga de un archivo igual
    event.target.value = ""; // Esto permite volver a cargar el mismo archivo
  };

  reader.readAsText(file); // Leer el archivo como texto
}

// Función para convertir un decimal a fracción
function decimalToFraction(decimal) {
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

  return isNegative
    ? `-${numerator}/${denominator}`
    : `${numerator}/${denominator}`;
}

function showNotification(message, resultMatrix = null, type = "success") {
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  // Crear el div para la notificación
  const notification = document.createElement("div");
  notification.classList.add("notification");

  // Aplica el tipo de notificación (error o éxito)
  if (type === "error") {
    notification.classList.add("error");
  }

  // Si hay una matriz de resultados, mostrarla en la notificación
  if (resultMatrix) {
    const result = resultMatrix.map((row) => row.join(", ")).join("\n");
    notification.innerHTML = `<strong>${message}</strong><pre>${result}</pre>`;
  } else {
    notification.textContent = message;
  }

  // Agregar la notificación al contenedor
  notificationContainer.appendChild(notification);

  // Eliminar la notificación después de 5 segundos
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => notification.remove(), 500); // Eliminarla después de que se desvanezca
  }, 5000); // La notificación durará 5 segundos
}

// Agregar el event listener para manejar la carga de archivo
document
  .getElementById("fileInput")
  .addEventListener("change", readFileAndUpdateMatrix);

// Función para mostrar la notificación
function showNotification(message, type = "success") {
  // Crear un div para la notificación
  const notification = document.createElement("div");
  notification.classList.add("notification", type);

  // Agregar el mensaje
  notification.textContent = message;

  // Crear el botón de cierre
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.classList.add("close-btn");
  closeBtn.onclick = () => {
    notification.style.opacity = 0; // Desvanecer la notificación
    setTimeout(() => notification.remove(), 500); // Eliminarla después de 500ms
  };

  // Agregar el botón de cierre al div de la notificación
  notification.appendChild(closeBtn);

  // Agregar la notificación al contenedor de notificaciones
  const container = document.getElementById("notification-container");
  container.appendChild(notification);

  // Hacer que la notificación se desvanezca después de 3 segundos
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => notification.remove(), 500); // Eliminarla después de desvanecerse
  }, 3000); // Duración de la notificación antes de desaparecer
}

// Función para copiar al portapapeles
function copyResult() {
  const resultText = document
    .getElementById("results-container")
    .textContent.trim();
  if (resultText) {
    // Copiar al portapapeles
    navigator.clipboard.writeText(resultText).then(
      () => {
        // Mostrar notificación de éxito
        showNotification("Resultado copiado al portapapeles!", "success");
      },
      (err) => {
        // Mostrar notificación de error
        showNotification("Error al copiar el resultado.", "error");
        console.error("Error al copiar al portapapeles: ", err);
      }
    );
  } else {
    // Mostrar notificación de error si no hay contenido para copiar
    showNotification("No hay resultados para copiar.", "error");
  }
}

// Función que borra el resultado en el contenedor
function deleteResult() {
  // Obtener el contenedor de resultados
  const resultsContainer = document.getElementById("results-container");

  // Verificar si hay contenido en el contenedor
  if (resultsContainer) {
    // Limpiar el contenido del contenedor de resultados
    resultsContainer.innerHTML = "";
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
