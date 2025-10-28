const express = require('express');
const app = express();
const sequelize = require('./config/database');
const productoRoutes = require('./routes/producto.route');
require('dotenv').config();
app.use(express.json());


app.use(productoRoutes);
{
    async () => {
        try {
            await sequelize.authenticate();
            console.log('Conexion establecida a la base de datos');
            await sequelize.sync({ alter: true });
            console.log('Tablas sincronizadas con la base de datos');
            app.listen(process.env.PORT, () => {
                console.log(`tu server esta corriendo en el puerto ${process.env.PORT}`);
            });
        } catch (error) {
            console.error('No se pudo conectar a la base de datos:', error);
        }
    }
}


