const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const categoria = sequelize.define('categoria', {
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
// Optional: autorrelación para subcategorías (mantener si la necesitas)
categoria.hasMany(categoria, {
    foreignKey: 'categoriaParentId',
    as: 'subcategorias'
});
categoria.belongsTo(categoria, {
    foreignKey: 'categoriaParentId',
    as: 'categoriaPadre'
});

module.exports = categoria;
