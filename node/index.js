const express = require('express')
const cors = require('cors')
const axios = require('axios'); // Librería para hacer solicitudes HTTP
const jwt = require('jsonwebtoken')
require("dotenv").config()



const app = express()
const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL;

// Middleware para habilitar CORS
app.use(cors())
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Body:`, req.body);
    next();
});

// ruta para la validacion de usuario con FastAPI
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    try {
        // envio los datos de las credenciales a Fastapi
        const fastApiResponse = await axios.post(`${process.env.FASTAPI_BASE_URL}/api/v1/veterinario/`, {
            username: username,
            password: password
        });

        // si FastAPI valida, crear el token con los datos adicionales
        const userData = fastApiResponse.data // datos de la respuesta de FastAPI
        const tokenPayload = {
            username: userData.username,
            nombres: userData.nombres,
            apellidos: userData.apellidos,
            direccion: userData.direccion,
            telefono: userData.telefono,
            tarjeta_profesional: userData.tarjeta_profesional,
            id: userData.id
        };

        const accessToken = generateAccessToken(tokenPayload)
        const refreshToken = generateRefreshToken(tokenPayload)

        return res.json({
            message: "User validated successfully",
            token: accessToken,
            refreshtoken: refreshToken,
            userData: userData
        });
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            return res.status(statusCode).json({ error: `Error ${statusCode}: ${error.response.data.message || 'Ocurrió un error'}` });
        }
    // return res.status(500).json({ error: 'Error al comunicarse con FastAPI' });
    console.error("Error al comunicarse con FastAPI:", error.message)
    res.status(500).json({ error: "Error interno del servidor"})
    }
});


function generateAccessToken(credentials) {
    return jwt.sign(credentials, process.env.SECRET, { expiresIn: '5m' });
}

function generateRefreshToken(credentials) {
    return jwt.sign(credentials, process.env.SECRET, { expiresIn: '7d' });
}


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


const port = 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
