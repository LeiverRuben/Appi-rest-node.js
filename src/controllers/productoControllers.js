const Producto = require('../models/producto.models');
exports.crearProductos = async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        const nuevoProducto = await Producto.create({
            nombre,
            precio,
            stock
        });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
}
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
}


