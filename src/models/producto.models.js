const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./categoria.models');
const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

})
//relacion 1:n (una categoria tiene muchos productos)
Categoria.hasMany(Producto,
    {
        foreignKey: 'categoriaId',
        as: 'productos'
    })
//relacion n:1 (un producto pertenece a una categoria
Producto.belongsTo(Categoria, {
    foreignKey: 'categoriaId',
    as: 'categoria'
});

module.exports = Producto;
