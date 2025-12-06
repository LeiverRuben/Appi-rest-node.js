const sequelize = require('./src/config/database');
const Producto = require('./src/models/producto.models');

async function checkProducts() {
    try {
        await sequelize.authenticate();
        const count = await Producto.count();
        console.log(`Total Productos en DB: ${count}`);

        if (count === 0) {
            console.log("⚠️  No hay productos. Creando productos de prueba...");
            // Crear productos dummy si no hay nada
            await Producto.bulkCreate([
                { nombre: 'Laptop Gamer', precio: 1200.50, stock: 10, categoriaId: 1 },
                { nombre: 'Mouse Inalámbrico', precio: 25.00, stock: 50, categoriaId: 1 },
                { nombre: 'Monitor 24"', precio: 180.00, stock: 15, categoriaId: 1 },
                { nombre: 'Teclado Mecánico', precio: 80.99, stock: 20, categoriaId: 1 },
                { nombre: 'Auriculares USB', precio: 45.00, stock: 30, categoriaId: 1 }
            ]);
            console.log("✅ 5 Productos creados.");
        } else {
            const prods = await Producto.findAll();
            console.log(JSON.stringify(prods, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkProducts();
