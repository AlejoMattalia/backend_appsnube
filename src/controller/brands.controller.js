
import { prisma } from "../database.js";
import { validateBrand } from "../helpers/validate.js";

const createBrand = async (req, res) => {
    try {
        const params = req.body;

        if (!params.name || !params.logo_url) {
            return res.status(400).json({
                status: "Error",
                message: "Faltan datos"
            });
        }


        // Validar los parámetros del usuario
        const validationErrors = validateBrand(params);

        if (validationErrors) {
            return res.status(400).json({
                status: "Error",
                messages: validationErrors
            });
        }


        //verificar que no exista una marca con el mismo nombre
        const existBrand = await prisma.brand.findUnique({
            where: { name: params.name }
        });

        if (existBrand) {
            return res.status(400).json({
                status: "Error",
                message: "La marca ya existe"
            });
        }

        const brand = await prisma.brand.create({
            data: {
                name: params.name,
                logo_url: params.logo_url
            }
        });

        res.status(200).json({
            status: "Success",
            message: "Se ha creado la marca",
            brand
        })
    }
    catch (error) {
        console.log(error);
        res.status(200).json({
            status: "Error",
            message: "No se pudo crear la marca"
        })
    }
}


const getBrands = async (req, res) => {
    try {
        const brands = await prisma.brand.findMany();

        res.status(200).json({
            status: "Success",
            message: "marcas",
            brands
        })
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
}


const updateBrand = async (req, res) => {
    try {
        const params = req.body;
        const id = parseInt(req.params.id, 10); // Convertir a entero

        if (isNaN(id)) { // Comprobar si la conversión fue exitosa
            return res.status(400).json({
                status: "Error",
                message: "El ID proporcionado no es válido"
            });
        }

        // Verificar si la marca existe
        const existBrand = await prisma.brand.findUnique({
            where: { id: id }
        });

        if (!existBrand) {
            return res.status(404).json({
                status: "Error",
                message: "La marca no existe"
            });
        }

        // Validar los parámetros del usuario
        if (!params || (!params.name && !params.logo_url)) {
            return res.status(400).json({
                status: "Error",
                message: "Faltan datos"
            });
        }

        // Verificar si el nombre de la marca ya existe
        const existBrand2 = await prisma.brand.findUnique({
            where: { name: params.name }
        });

        if (existBrand2) {
            return res.status(400).json({
                status: "Error",
                message: "La marca ya existe"
            });
        }

        const brand = await prisma.brand.update({
            where: { id: id },
            data: {
                name: params.name,
                logo_url: params.logo_url
            }
        });

        res.status(200).json({
            status: "Success",
            message: "Se ha actualizado la marca",
            brand
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Error",
            message: "No se pudo actualizar la marca"
        });
    }
};


const deleteBrand = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10); // Convertir a entero

        if (isNaN(id)) { // Comprobar si la conversión fue exitosa
            return res.status(400).json({
                status: "Error",
                message: "El ID proporcionado no es válido"
            });
        }

        // Verificar si la marca existe 
        const existBrand = await prisma.brand.findUnique({
            where: { id: id }
        });

        if (!existBrand) {
            return res.status(404).json({
                status: "Error",
                message: "La marca no existe"
            });
        }

        const brand = await prisma.brand.delete({
            where: { id: id }
        });

        res.status(200).json({
            status: "Success",
            message: "Se ha eliminado la marca",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Error",
            message: "No se pudo eliminar la marca"
        });
    }
};
        

export default {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
}