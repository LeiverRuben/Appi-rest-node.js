const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());

app.get('/api/hello', (req, res) => {
    var nombre = 'Zamora';
    res.status(200).json(`hola mi nombre es  ${nombre}`)
})
app.post('/api/hello', (req, res) => {
    const body = req.body;
    const { nombre, apellido } = req.body;
    console.log(nombre, apellido)
    res.status(201).json({ name: 'se recibio correctamente' })
})
app.listen(process.env.PORT, () => {
    console.log(`tu server esta corriendo en el puerto ${process.env.PORT}`);
});