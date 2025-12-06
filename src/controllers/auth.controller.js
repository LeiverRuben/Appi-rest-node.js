const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuarios.model');

const generarToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, nombre: user.nombre },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

const generarRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;


        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Faltan datos requeridos (nombre, email, password)' });
        }


        const existe = await Usuario.findOne({ where: { email: email } });

        if (existe) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({ nombre, email, password: hash });

        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const usuario = await Usuario.findOne({ where: { email: email } });

        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas (Usuario no encontrado)' });
        }


        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) {
            return res.status(400).json({ message: 'Credenciales inválidas (Contraseña incorrecta)' });
        }

        const token = generarToken(usuario);
        const refreshToken = generarRefreshToken(usuario);


        await usuario.update({ refreshToken: refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: 'Login exitoso', token: token });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'No autorizado' });

        const usuario = await Usuario.findOne({ where: { refreshToken: token } });
        if (!usuario) return res.status(401).json({ message: 'No autorizado' });

        try {
            jwt.verify(token, process.env.JWT_SECRET);
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
            res.clearCookie('refreshToken');
            return res.status(204).end();
        }

        await usuario.update({ refreshToken: null });
        res.clearCookie('refreshToken');
        res.json({ message: 'Logout exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
}