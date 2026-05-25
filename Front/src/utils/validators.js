import { FORM_ERRORS } from '../constants/formErrors';

export const validarNombre = (nombre) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]+$/;

    if(!nombre) {
        return FORM_ERRORS.REQUIRED;
    }

    if(nombre.length < 2) {
        return {
            code: FORM_ERRORS.MIN_LENGTH,
            values: {
                minLength: 2
            }
        };
    }

    if (!regex.test(nombre)) {
        return FORM_ERRORS.NAME;
    }

    return null;
}

export const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email) {
        return FORM_ERRORS.REQUIRED;
    }

    if(!regex.test(email)) {
        return FORM_ERRORS.EMAIL;
    }

    return null;
}

export const validarTelefono = (telefono) => {

    if (!telefono) {
        return FORM_ERRORS.REQUIRED;
    }

    const regex = /^[0-9]{9}$/;

    if (!regex.test(telefono)) {
        return FORM_ERRORS.PHONE;
    }

    return null;
};

export const validarPassword = (password) => {
    const regex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-._!@#$%^&*])/;

    if(!password) {
        return FORM_ERRORS.REQUIRED;
    }

    if(password.length < 8) {
        return {
            code: FORM_ERRORS.MIN_LENGTH,
            values: {
                minLength: 8
            }
        };
    }


    if(!regex.test(password)) {
        return FORM_ERRORS.PASSWORD_FORMAT;
    }

    return null;
};

export const validarConfirmPassword = (password, confirmPassword) => {
    if(!confirmPassword) {
        return FORM_ERRORS.REQUIRED;
    }

    if(password !== confirmPassword) {
        return FORM_ERRORS.PASSWORD_MATCH;
    }

    return null;
};

export const validarSpecialCharacters = (texto) => {

    const regex = /[<>/"'`;(){}]/;

    if (regex.test(texto)) {
        return FORM_ERRORS.SPECIAL_CHARACTERS;
    }

    return null;
};

export const validarDireccion = (direccion) => {
    if (!direccion) return FORM_ERRORS.REQUIRED;
    if (direccion.length < 5) return { code: FORM_ERRORS.MIN_LENGTH, values: { minLength: 5 } };
    return null;
};

export const validarCiudad = (ciudad) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-]+$/;
    if (!ciudad) return FORM_ERRORS.REQUIRED;
    if (!regex.test(ciudad)) return FORM_ERRORS.NAME;
    return null;
};

export const validarCodigoPostal = (cp) => {
    const regex = /^[0-9]{4,10}$/;
    if (!cp) return FORM_ERRORS.REQUIRED;
    if (!regex.test(cp)) return FORM_ERRORS.PHONE;
    return null;
};

export const validarPais = (pais) => {
    if (!pais) return FORM_ERRORS.REQUIRED;
    if (pais.length < 2) return { code: FORM_ERRORS.MIN_LENGTH, values: { minLength: 2 } };
    return null;
};

export const validarNumeroTarjeta = (numero) => {
    if (!numero) return FORM_ERRORS.REQUIRED;
    const soloNumeros = numero.replace(/\s/g, '');
    if (soloNumeros.length < 16) return { code: FORM_ERRORS.MIN_LENGTH, values: { minLength: 16 } };
    return null;
};

export const validarCaducidad = (caducidad) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!caducidad) return FORM_ERRORS.REQUIRED;
    if (!regex.test(caducidad)) return FORM_ERRORS.REQUIRED;
    return null;
};

export const validarCVV = (cvv) => {
    const regex = /^[0-9]{3,4}$/;
    if (!cvv) return FORM_ERRORS.REQUIRED;
    if (!regex.test(cvv)) return FORM_ERRORS.REQUIRED;
    return null;
};