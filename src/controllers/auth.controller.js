const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarios.model');

const generarToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, nombre: user.nombre }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
const generarrefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const usuarioExistente = await usuarioModel.findOne({ where: { email: email } })
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El correo ya esta registrado' });
        }
        const hashedPassword = await bycrypt.hash(password, 10);
        const nuevoUsuario = await usuarioModel.create({ nombre, email, password: hashedPassword });
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await usuario.findOne({ where: { email: email } });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Credenciales invalidas' });
        }
        const passwordValido = await bycrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ mensaje: 'Credenciales invalidas' });
        }
        const token = generarToken(usuario);
        const refreshToken = generarrefreshToken(usuario);
        await usuario.update({ refeshToken: refreshToken });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        });

        res.status(200).json({ mensaje: 'Login exitoso', token, refreshToken });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'No autorizado' });
        console.log(token)
        const usuario = await Usuario.findOne({ where: { refreshToken: token } });
        console.log(usuario)
        if (!usuario) return res.status(401).json({ message: 'No autorizado' });

        try {
            jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
        } catch (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        const nuevoToken = generarToken(usuario);
        res.status(200).json({ token: nuevoToken });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(204).end();
        const usuario = await Usuario.findOne({ where: { refreshToken: token } });
        if (!usuario) {
            res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'strict' });
            return res.status(204).end();
        }
        await usuario.update({ refreshToken: null });
        res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'strict' });
        res.json({ message: 'Logout exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}