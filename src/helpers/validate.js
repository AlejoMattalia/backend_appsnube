import validator from "validator";

const validateUser = (params) => {
    let emailValid = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    let name = !validator.isEmpty(params.name) && validator.isLength(params.name, { min: 3 });
    let passwordValid = !validator.isEmpty(params.password) && validator.isLength(params.password, { min: 6 });
    let roleValid = !validator.isEmpty(params.role) && validator.isIn(params.role, ["user", "admin"]);

    // Crear un arreglo para almacenar mensajes de error
    const errors = [];

    if (!emailValid) {
        errors.push("Email inválido");
    }
    if (!passwordValid) {
        errors.push("Contraseña inválida");
    }
    if (!roleValid) {
        errors.push("Rol inválido");
    }

    // Si hay errores, retornarlos; si no, retornar null
    return errors.length > 0 ? errors : null;
}


const validateBrand = (params) => {
    let name = !validator.isEmpty(params.name) && validator.isLength(params.name, { min: 3 });
    let logo_url = !validator.isEmpty(params.logo_url) && validator.isURL(params.logo_url);

    // Crear un arreglo para almacenar mensajes de error
    const errors = [];

    if (!name) {
        errors.push("Nombre inválido");
    }
    if (!logo_url) {
        errors.push("URL inválida");
    }

    // Si hay errores, retornarlos; si no, retornar null    
    return errors.length > 0 ? errors : null;
}



const validateProduct = (params) => {
    let name = !validator.isEmpty(String(params.name)) && validator.isLength(String(params.name), { min: 3 });
    let description = !validator.isEmpty(String(params.description)) && validator.isLength(String(params.description), { min: 3 });
    let image_url = !validator.isEmpty(String(params.image_url)) && validator.isURL(String(params.image_url));
    let price = !validator.isEmpty(String(params.price)) && validator.isDecimal(String(params.price));
    let stock = !validator.isEmpty(String(params.stock)) && validator.isDecimal(String(params.stock));
    let brand_id = !validator.isEmpty(String(params.brand_id)) && validator.isDecimal(String(params.brand_id));

    const errors = [];

    if (!name) {
        errors.push("Nombre inválido");
    }
    if (!description) {
        errors.push("Descripción inválida");
    }
    if (!image_url) {
        errors.push("URL inválida");
    }
    if (!price) {
        errors.push("Precio inválido");
    }
    if (!stock) {
        errors.push("Stock inválido");
    }
    if (!brand_id) {
        errors.push("ID inválido");
    }

    return errors.length > 0 ? errors : null;
}


const validateOrder = (params) => {
    let errors = [];
  
    // Validar user_id
    if (typeof params.user_id !== 'number' || isNaN(params.user_id) || params.user_id <= 0) {
        errors.push('User ID inválido');
    }

    // Validar total
    if (typeof params.total !== 'number' || isNaN(params.total) || params.total <= 0) {
        errors.push('Total inválido');
    }
  
    // Validar el array de productos
    if (!Array.isArray(params.products) || params.products.length === 0) {
        errors.push('El array de productos no puede estar vacío');
    } else {
        params.products.forEach((product, index) => {
            // Validar product_id
            if (typeof product.product_id !== 'number' || isNaN(product.product_id) || product.product_id <= 0) {
                errors.push(`Product ID inválido en el producto ${index + 1}`);
            }
            // Validar cantidad
            if (typeof product.quantity !== 'number' || isNaN(product.quantity) || product.quantity <= 0) {
                errors.push(`Cantidad inválida en el producto ${index + 1}`);
            }
        });
    }
  
    // Si hay errores, retornarlos; si no, retornar null
    return errors.length > 0 ? errors : null;
};

export {
    validateUser,
    validateBrand,
    validateProduct,
    validateOrder
}
