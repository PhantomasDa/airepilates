const express = require('express');
const { verifyToken } = require('../middleware/auth'); // Asegúrate de que la ruta a auth.js sea correcta
const db = require('../database');
const router = express.Router();

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM Usuarios WHERE id = ?', [req.userId]);
        if (users.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user = users[0];
        res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({ message: 'Error fetching profile' });
    }
});

module.exports = router;
