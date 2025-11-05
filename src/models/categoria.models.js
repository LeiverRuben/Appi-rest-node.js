const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { categoria } = require('.');

const Categoria = sequelize.define('Categoria', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})
categoria.hasMany(Categoria, {
    foreignKey: 'categoriaID',
    as: 'subcategorias'
});
Categoria.belongsTo(categoria, {
    foreignKey: 'categoriaID',
    as: 'categoriaPadre'
});
module.exports = Categoria;
