import { matrix } from "../matrixUtils.js";
import { showNotification } from "./utils.js";

export function gaussJordan(matrix) {
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

export function calculateDeterminant(matrix) {
  // Verificar si la matriz es cuadrada
  if (matrix.length === matrix[0].length) {
    // Calcular el determinante usando math.js
    return math.det(matrix);
  }
}

export function calculateInverse(matrix) {
  if (matrix.length !== matrix[0].length) {
    throw new Error(
      "La matriz no es cuadrada. No se puede calcular la inversa."
    );
  }

  const determinant = calculateDeterminant(matrix);
  if (determinant === 0) {
    throw new Error("La matriz es singular y no tiene inversa.");
  }

  return math.inv(matrix); // Calcular la inversa usando math.js
}

export function createIdentityMatrix(size) {
  const identityMatrix = [];
  for (let i = 0; i < size; i++) {
    const row = Array(size).fill(0);
    row[i] = 1;
    identityMatrix.push(row);
  }
  return identityMatrix;
}
