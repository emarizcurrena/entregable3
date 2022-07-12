const express = require('express');
const Contenedor = require('./modulos/contenedor')
const contenedor = new Contenedor("productos.txt");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidos http escuchando en el puerto ${server.address().port} usando express`)
})

const router = express.Router();

app.use('/api/productos', router);

// GET /api/productos
router.get('/', async (req, res) => {
    const productos = await contenedor.getFileContent();
    res.status(200).json(productos)
})

// // GET /api/productos/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await contenedor.getById(id);

    product
        ? res.status(200).json(product)
        : res.status(404).json({ error: "Producto no encontrado" });

})

// POST /api/productos
router.post('/', async (req, res) => {
    const { body } = req;
    const newProductId = await contenedor.save(body);
    res.status(200).send(`Producto agregado con el ID: ${newProductId}`)
})

// PUT /api/productos/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const wasUpdated = await contenedor.updateById(id, body);
    wasUpdated
        ? res.status(200).send(`El producto de ID: ${id} fue actualizado`)
        : res.status(404).send(`El producto no fue actualizado porque no se encontró el ID: ${id}`);
})


// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    contenedor.getById(id).then(result => {
        if (result) {
            contenedor.deleteById(id).then(sarasa => res.status(200).send("Producto borrado"));
        } else {
            res.status(404).json({ error: "Ese producto no existe" });
        }
    })
})

app.use('/static', express.static(__dirname + '/public'))

server.on("error", e => console.log(`Error en servidor ${e}`))