const Producto = require('../models/producto.models');
exports.crearProductos = async (req, res) => {
    try {
        const { nombre, precio, stock, descripcion } = req.body;
        const nuevoProducto = await Producto.create({
            nombre,
            precio,
            stock,
            descripcion
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
};
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};
exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock, descripcion } = req.body;
        const producto = await Producto.findByPk(id);
        if (producto) {
            producto.nombre = nombre || producto.nombre;
            producto.precio = precio || producto.precio;
            producto.stock = stock || producto.stock;
            producto.descripcion = descripcion || producto.descripcion;
            await producto.save();
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (producto) {
            await producto.destroy();
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
};

