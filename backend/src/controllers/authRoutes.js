const express = require('express');
const router = express.Router();

// Aquí definiremos quién maneja la lógica (el controlador)
// Por ahora, solo responderemos con un mensaje de prueba
router.post('/registro', (req, res) => {
    res.status(200).json({
        status: 'success',
        mensaje: '📩 El servidor de Deporty recibió tus datos de registro.'
    });
});

module.exports = router;