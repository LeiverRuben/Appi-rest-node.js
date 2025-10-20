const express = require('express');
const app = express();

require('dotenv').config();

app.listen(process.env.PORT, () => {
    console.log('tu server esta corriendo en el puerto', process.env.PORT);
})