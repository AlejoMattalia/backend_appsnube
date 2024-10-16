import { prisma } from "../database.js";
import { validateOrder } from "../helpers/validate.js";

const createOrder = async (req, res) => {
    try {
        const params = req.body;

        if(!params.user_id || params.products === undefined) {
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


        //Verificar si la persona existe
        const existUser = await prisma.user.findUnique({
            where: { id: params.user_id }
        });

        if (!existUser) {
            return res.status(400).json({
                status: "Error",
                message: "El usuario no existe"
            });
        }


        //Verificar si los productos existen
        const existProducts = await prisma.product.findMany({
            where: { id: { in: params.products.map(product => product.product_id) } }
        });

        if (existProducts.length !== params.products.length) {
            return res.status(400).json({
                status: "Error",
                message: "Algunos de los productos no existen"
            });
        }

        //crear referencia
        const reference = Math.random().toString(36).substring(2, 12);

        //verificar que no exista una orden con el mismo referencia
        const existOrder = await prisma.order.findUnique({
            where: { reference: reference }
        });
        if (existOrder) {
            return res.status(400).json({
                status: "Error",
                message: "La orden ya existe"
            });
        }

        const order = await prisma.order.create({
            data: {
              reference,
              user: {
                connect: { id: params.user_id }, // Conecta la orden con el usuario
              },
              orderItems: {
                create: params.products.map((product) => ({
                  product: {
                    connect: { id: product.product_id }, // Conecta el producto
                  },
                  quantity: product.quantity || 1, // Cantidad del producto
                })),
              },
            },
            include: {
              orderItems: true, // Incluye los productos en la respuesta
            },
          });


        res.status(200).json({
            status: "Success",
            message: "Se ha creado la orden",
            order
        })
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ status: "Error", message: "Error al crear la orden" });
    }
}


const listOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                orderItems: {
                    include: {
                        product: true, // Incluir todos los datos del producto
                    }
                },
            },
        });

        res.status(200).json({
            status: "Success",
            message: "Se han encontrado las ordenes",
            orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", message: "Error al encontrar las ordenes" });
    }
};


export default { createOrder, listOrders }