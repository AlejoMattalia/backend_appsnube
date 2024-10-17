import cors from 'cors';
import express from 'express';
import dotenv from "dotenv";

dotenv.config(); 

//Mensaje de inicio de la app
console.log('App inciada con exito');


//server
const app = express();
const port = 4000;



app.use(cors());


//Convertir los datos del body en objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));




//Rutas
import userRoutes from './routes/users.routes.js';
import productRoutes from './routes/products.routes.js';
import orderRoutes from './routes/orders.routes.js';
import brandRoutes from './routes/brands.routes.js';


app.use('/api/auth/', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/brand', brandRoutes);



//Poner al servidor a escuchar peticione HTTP
app.listen(port, ()=> console.log("Servidor de node corriendo en el puerto" + port))