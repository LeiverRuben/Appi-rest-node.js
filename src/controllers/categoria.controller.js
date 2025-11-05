const categoria = require('../models/categoria.models');

exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevaCategoria = await categoria.create({
            nombre,
            descripcion

        });
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoria', error });
    }
};
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoria.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorias', error });
    }
};
exports.obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaEncontrada = await categoria.findByPk(id);
        if (categoriaEncontrada) {
            res.status(200).json(categoriaEncontrada);
        } else {
            res.status(404).json({ message: 'Categoria no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la categoria', error });
    }
};
exports.actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const { descripcion } = req.body;
        const categoriaEncontrada = await categoria.findByPk(id);
        if (categoriaEncontrada) {
            categoriaEncontrada.nombre = nombre || categoriaEncontrada.nombre;
            categoriaEncontrada.descripcion = descripcion || categoriaEncontrada.descripcion;
            await categoriaEncontrada.save();
            res.status(200).json(categoriaEncontrada);
        } else {
            res.status(404).json({ message: 'Categoria no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la categoria', error });
    }
};

exports.eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaEncontrada = await categoria.findByPk(id);
        if (categoriaEncontrada) {
            await categoriaEncontrada.destroy();
            res.status(200).json({ message: 'Categoria eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Categoria no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoria', error });
    }
};
