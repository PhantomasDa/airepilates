const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta'; // Debe ser segura y secreta

// Generar token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, {
        expiresIn: '1h', // Token válido por 1 hora
    });
};

// Middleware para verificar el token JWT
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No autorizado');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Guardar usuario decodificado en la solicitud para su uso posterior
        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(401).send({ message: 'Token inválido', error: error.message });
    }
}

// Middleware para verificar si el usuario está autenticado mediante sesión
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'Debes iniciar sesión para acceder a esta página');
        res.redirect('/login');
    }
};

// Ruta para manejar el inicio de sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Aquí deberías verificar las credenciales del usuario...
    if (username === 'user' && password === 'password') {
        req.session.user = { username: 'user' }; // Configura los datos de la sesión
        res.redirect('/profile');
    } else {
        req.flash('error', 'Credenciales incorrectas');
        res.redirect('/login');
    }
});

// Ruta para manejar el cierre de sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = { 
    generateToken,
    verifyToken, 
    isAuthenticated, 
    router 
};