import { prisma } from "../database.js";
import { validateOrder } from "../helpers/validate.js";

const createOrder = async (req, res) => {
    try {
        const params = req.body;

        if (!params.user_id || params.products === undefined || !params.total) {
            return res.status(400).json({
                status: "Error",
                message: "Faltan datos"
            });
        }

        // Validar los parámetros del usuario
        const validationErrors = validateOrder(params);
        if (validationErrors) {
            return res.status(400).json({
                status: "Error",
                messages: validationErrors
            });
        }

        // Verificar si la persona existe
        const existUser = await prisma.user.findUnique({
            where: { id: params.user_id }
        });

        if (!existUser) {
            return res.status(400).json({
                status: "Error",
                message: "El usuario no existe"
            });
        }

        // Verificar si los productos existen
        const existProducts = await prisma.product.findMany({
            where: { id: { in: params.products.map(product => product.product_id) } }
        });

        if (existProducts.length !== params.products.length) {
            return res.status(400).json({
                status: "Error",
                message: "Algunos de los productos no existen"
            });
        }

        // Crear referencia
        const reference = Math.random().toString(36).substring(2, 12);

        // Verificar que no exista una orden con la misma referencia
        const existOrder = await prisma.order.findUnique({
            where: { reference: reference }
        });

        if (existOrder) {
            return res.status(400).json({
                status: "Error",
                message: "La orden ya existe"
            });
        }

        // Crear la orden con el total incluido
        const order = await prisma.order.create({
            data: {
                reference,
                total: params.total, // Agregar el total de la orden
                user: {
                    connect: { id: params.user_id }, // Conectar la orden con el usuario
                },
                orderItems: {
                    create: params.products.map((product) => ({
                        product: {
                            connect: { id: product.product_id }, // Conectar el producto
                        },
                        quantity: product.quantity || 1, // Cantidad del producto
                    })),
                },
            },
            include: {
                orderItems: true, // Incluir los productos en la respuesta
            },
        });

        res.status(200).json({
            status: "Success",
            message: "Se ha creado la orden",
            order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", message: "Error al crear la orden" });
    }
};



const listOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true, // Incluir el usuario aunque pueda ser null
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true, // Solo obtener el nombre del producto
                            },
                        },
                    },
                },
            },
        });

        // Mapear los resultados y asegurarse de que el usuario no sea null
        const sanitizedOrders = orders.map(order => ({
            ...order,
            user: order.user ? { name: order.user.name, email: order.user.email } : null, // Si no hay usuario, poner null
        }));

        res.status(200).json({
            status: "Success",
            message: "Se han encontrado las órdenes",
            orders: sanitizedOrders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", message: "Error al encontrar las órdenes" });
    }
};



export default { createOrder, listOrders }