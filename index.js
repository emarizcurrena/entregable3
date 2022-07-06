const express = require('express');
const Contenedor = require('./contenedor.js')

const app = express();
const contenedor = new Contenedor('productos.txt')
const PORT = 8080

const productos = [{ nombre: "elisa" }, { nombre: "fran" }]

const server = app.listen(PORT, () => {
    console.log(`Servidos http escuchando en el puerto ${server.address().port} usando express`)
})

app.get('/', (req, res) => {
    res.send({ mensaje: 'hola mundo' })
})

app.get('/productos', (req, res) => {
    contenedor.getFileContent().then((resultado) => {
        res.send(resultado);
    })
})

app.get('/productoRandom', (req, res) => {
    contenedor.getFileContent().then((resultado) => {
        res.send(resultado[Math.floor(Math.random() * productos.length)]);
    })
})


server.on("error", e => console.log(`Error en servidor ${e}`))