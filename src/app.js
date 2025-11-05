const express = require('express');
const app = express();
const sequelize = require('./config/database');
const productoRoutes = require('./routes/producto.route');
const categoriaRoutes = require('./routes/categoria.routes');
require('dotenv').config();
app.use(express.json());

app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexion establecida a la base de datos');
        await sequelize.sync({ alter: true });
        console.log('Tablas sincronizadas con la base de datos');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`tu server esta corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
})();


