import { createToken, secret } from "../service/jwt.js";
import { validateUser } from "../helpers/validate.js";
import { prisma } from "../database.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    try {
        const params = req.body;

        // Verificar que los campos
        if (!params.email || !params.name || !params.password || !params.role) {
            return res.status(400).json({
                status: "Error",
                message: "Faltan datos"
            });
        }

        // Validar los parámetros del usuario
        const validationErrors = validateUser(params);

        if (validationErrors) {
            return res.status(400).json({
                status: "Error",
                messages: validationErrors
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: params.email }
        });

        if (existingUser) {
            return res.status(400).json({
                status: "Error",
                message: "El email ya está registrado"
            });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(params.password, 10);
        params.password = hashedPassword;

        // Crear el usuario
        const user = await prisma.user.create({
            data: params
        });

        // Crear el token
        const token = createToken(user);

        // Si la validación es exitosa, devolver el usuario sin la contraseña
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            message: "Usuario creado",
            user: userWithoutPassword,
            token
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            status: "Error",
            message: "Error creando usuario"
        });
    }
}



const login = async (req, res) => {
    try {
        const params = req.body;

        if(!params.email || !params.password) {
            return res.status(400).json({
                status: "Error",
                message: "No pudiste iniciar sesión, faltan datos por enviar"
            });
        }

        // Validar los parámetros del usuario
        const user = await prisma.user.findUnique({
            where: { email: params.email }
        });    
        
        
        if (!user) {
            return res.status(400).json({
                status: "Error",
                message: "El usuario no existe"
            });
        }

        const pwd = await bcrypt.compare(params.password, user.password);

        if (!pwd) {
            return res.status(400).json({
                status: "Error",
                message: "La contraseña es incorrecta"
            });
        }

        const token = createToken(user);

        res.status(200).json({
            message: "Sesión iniciada",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            status: "Error",
            message: "Error creando usuario"
        });
    }
}


export default {
    register,
    login
}
