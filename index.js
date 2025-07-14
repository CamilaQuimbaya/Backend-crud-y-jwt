require('dotenv').config();

const express = require('express');
const conectarDB = require('./config/db')
const router = require('./routes/nota')
const authRouter = require('./routes/auth')
const cors = require('cors')

const app = express();

conectarDB(); // Conectar a la base de datos

app.use(cors())

const port = 3000;

//middleware para leer datos en formato JSON
app.use(express.json())

app.use('/api', router); // Usar las rutas de notas
app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
    res.send("hola mundo desde express");
})



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})