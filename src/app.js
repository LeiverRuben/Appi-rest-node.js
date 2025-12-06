const express = require('express');
const app = express();
const sequelize = require('./config/database');
const productoRoutes = require('./routes/producto.route');
const categoriaRoutes = require('./routes/categoria.routes');
const contactRoutes = require('./routes/contact.route');
require('dotenv').config();
app.use(express.json());

const authRoutes = require('./routes/auth.route');
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/contact', contactRoutes);

const billRoutes = require('./routes/bill.route');
app.use('/api/bills', billRoutes);

const reportRoutes = require('./routes/report.route');
app.use('/api/reports', reportRoutes);

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

(
    async () => {
        await sequelize.authenticate();
        console.log("conexion establecida a la base de datos");
        // Usar force: true solo en desarrollo - ELIMINA Y RECREA las tablas
        await sequelize.sync({ alter: true });
        console.log("tablas sincronizadas");
        app.listen(process.env.PORT, () => {
            console.log("servidor corriendo en el puerto " + process.env.PORT);
        })

    }
)();


