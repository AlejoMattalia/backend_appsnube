import {validateProduct} from "../helpers/validate.js";
import {prisma} from "../database.js";

const createProduct = async (req, res) => {
    try {
        const params = req.body;

        if(!params.name || !params.description || !params.image_url || !params.price || !params.stock || !params.brand_id) {
            return res.status(400).json({
                status: "Error",
                message: "Faltan datos"
            });
        }


        // Validar los parámetros del usuario
        const validationErrors = validateProduct(params);
        if (validationErrors) {
            return res.status(400).json({
                status: "Error",
                messages: validationErrors
            });
        }


        //verificar qque no exista un producto con el mismo nombre
        const existProduct = await prisma.product.findUnique({
            where: { name: params.name }
        });

        if (existProduct) {
            return res.status(400).json({
                status: "Error",
                message: "El producto ya existe"
            });
        }


        //verifica si la marca existe
        const brandId = parseInt(params.brand_id, 10);
        const existBrand = await prisma.brand.findUnique({
            where: { id: brandId }
        });

        if (!existBrand) {
            return res.status(400).json({
                status: "Error",
                message: "La marca no existe"
            });
        }

        const productData = {
            name: params.name,
            description: params.description,
            image_url: params.image_url,
            price: parseFloat(params.price), 
            stock: parseInt(params.stock, 10), 
            brand_id: parseInt(params.brand_id, 10) 
        };

        const product = await prisma.product.create({
            data: productData
        });

        res.status(200).json({
            status: "Success",
            message: "Se ha creado el producto",
            product
        })
    }
    catch(error) {
        console.log(error);
        res.status(200).json({
            status: "Error",
            message: "No se pudo crear el producto"
        })
    }
}


const oneProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (!id) {
            return res.status(400).json({
                status: "Error",
                message: "Faltan datos"
            });
        }

        const product = await prisma.product.findUnique({
            where: { id: id },
            include: {
                brand: true // Incluir toda la información de la marca
            }
        });

        if (!product) {
            return res.status(404).json({
                status: "Error",
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Se ha encontrado el producto",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Error",
            message: "No se pudo encontrar el producto"
        });
    }
};


const getProducts = async (req, res) => {
    // Obtener el número de página desde los parámetros de la URL (req.params.page)
    const page = parseInt(req.params.page) || 1;
    const pageSize = 10; // Definir el tamaño de la página (10 productos por página)

    try {
        // Obtener el total de productos
        const totalProducts = await prisma.product.count();

        // Calcular cuántos productos saltar basándonos en la página actual
        const products = await prisma.product.findMany({
            skip: (page - 1) * pageSize, // Cuántos productos saltar
            take: pageSize, // Cuántos productos tomar
            include: {
                brand: true // Incluir toda la información de la marca
            }
        });

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalProducts / pageSize);

        res.status(200).json({
            status: "Success",
            message: "Productos",
            currentPage: page,
            totalPages,
            totalProducts,
            products
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};



const updateProduct = async (req, res) => {
    try {
        const params = req.body;
        const id = req.params.id;

        if(!params || !id) {
            return res.status(400).json({
                status: "Error",
                message: "Faltan datos"
            });
        }


        if(params.brand_id){
            const existBrand = await prisma.brand.findUnique({
                where: { id: +params.brand_id }
            });

            if (!existBrand) {
                return res.status(400).json({
                    status: "Error",
                    message: "La marca no existe"
                });
            }
        }


        //verifica si la persona existe
        const existProduct = await prisma.product.findUnique({
            where: { id: +id }
        });

        if (!existProduct) {
            return res.status(404).json({
                status: "Error",
                message: "El producto no existe"
            });
        }

        const product = await prisma.product.update({
            where: { id: +id },
            data: params
        });

        res.status(200).json({
            status: "Success",
            message: "Se ha actualizado el producto",
            product
        })
    }
    catch(error) {
        console.log(error);
        res.status(200).json({
            status: "Error",
            message: "No se pudo actualizar el producto"
        })
    }
}


const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10); // Convertir a entero

        if (isNaN(id)) { // Comprobar si la conversión fue exitosa
            return res.status(400).json({
                status: "Error",
                message: "El ID proporcionado no es válido"
            });
        }

        // Verificar si la marca existe 
        const existProduct = await prisma.product.findUnique({
            where: { id: id }
        });

        if (!existProduct) {
            return res.status(404).json({
                status: "Error",
                message: "El producto no existe"
            });
        }

        const product = await prisma.product.delete({
            where: { id: id }
        });

        res.status(200).json({
            status: "Success",
            message: "Se ha eliminado el producto",
            product
        })
    }
    catch(error) {
        console.log(error);
        res.status(200).json({
            status: "Error",
            message: "No se pudo eliminar el producto"
        })
    }
}

export default {
    createProduct,
    oneProduct,
    getProducts,
    updateProduct,
    deleteProduct
}