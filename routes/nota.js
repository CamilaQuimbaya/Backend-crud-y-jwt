const express = require('express');
const router = express.Router();

const notaController = require('../controllers/notaController')
const auth = require('../middleware/auth')

// Rutas para las notas
router.post('/nota', auth, notaController.crearNota);
router.get('/notas', auth, notaController.obtenerNotas);
router.get('/notas/:id',auth, notaController.obtenerNotaPorId);
router.put('/notas/:id',auth, notaController.actualizarNota)
router.delete('/notas/:id', auth, notaController.eliminarNota)



module.exports = router;
