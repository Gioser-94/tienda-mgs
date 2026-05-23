
/**
 * Calcula el total del carrito
 */
export const calcularTotalCarrito = (productos) => {
  return productos.reduce((total, item) => {
    const precioFinal = calcularPrecioConDescuento(item.precio, item.descuento || 0);
    return total + (precioFinal * item.cantidad);
  }, 0);
};


// ========== VALIDACIONES DE FORMULARIOS COMPLETOS ==========

/**
 * Valida formulario de registro completo
 * Retorna { valido: boolean, errores: object }
 */
export const validarFormularioRegistro = (datos) => {
  const errores = {};

  if (!validarCampoNoVacio(datos.nombre)) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (!validarNombre(datos.nombre)) {
    errores.nombre = 'El nombre solo puede contener letras';
  }

  if (!validarCampoNoVacio(datos.apellidos)) {
    errores.apellidos = 'Los apellidos son obligatorios';
  }

  if (!validarCampoNoVacio(datos.email)) {
    errores.email = 'El email es obligatorio';
  } else if (!validarEmail(datos.email)) {
    errores.email = 'El email no es válido';
  }

  if (!validarCampoNoVacio(datos.password)) {
    errores.password = 'La contraseña es obligatoria';
  } else if (!validarPassword(datos.password)) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (datos.password !== datos.confirmPassword) {
    errores.confirmPassword = 'Las contraseñas no coinciden';
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};