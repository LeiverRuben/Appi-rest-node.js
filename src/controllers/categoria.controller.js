const categoria = require('../models/categoria.models');

exports.crearCategoria = async (req, res) => {

    try {
        const { nombre } = req.body;
        const nuevaCategoria = await categoria.create({ nombre });
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