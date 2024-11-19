// Eliminar duplicado de showNotification
/*export function showNotification(message, type = "success") {
  
}

// Función para mostrar notificaciones
/*export function showNotification(
  message,
  type = "success",
  resultMatrix = null
) {
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  if (!notificationContainer) {
    console.error("El contenedor de notificaciones no se encuentra en el DOM.");
    return;
  }

  // Crear el div para la notificación
  const notification = document.createElement("div");
  notification.classList.add("notification", type);

  // Si hay una matriz de resultados, mostrarla en la notificación
  if (resultMatrix) {
    const result = resultMatrix.map((row) => row.join(", ")).join("\n");
    notification.innerHTML = `<strong>${message}</strong><pre>${result}</pre>`;
  } else {
    notification.textContent = message;
  }

  // Agregar la notificación al contenedor
  notificationContainer.appendChild(notification);

  // Configurar la eliminación automática de la notificación
  setTimeout(() => {
    notification.style.opacity = 0; // Desvanece la notificación
    setTimeout(() => notification.remove(), 500); // Elimina el nodo del DOM
  }, 5000); // Tiempo de vida de la notificación
}*/
