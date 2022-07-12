const fs = require('fs')

module.exports = class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.id = 1;
    }


    async getFileContent() {
        try {
            const contenido = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
            return JSON.parse(contenido);

        } catch (error) {
            console.log(error)
        }
    }


    // Recibe objeto, le agrega id, lo agrega al archivo y devuelve id
    async save(newObject) {
        let contenido = await this.getFileContent()
        let maxId = 0;
        if (contenido.length === 0) {
            newObject.id = 1;
        } else {
            contenido.forEach(element => {
                if (element.id > maxId) {
                    maxId = element.id;
                }
            });
            newObject.id = maxId + 1;
        }

        contenido.push(newObject);
        fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(contenido))
            .then(() => {

            })
        return newObject.id
    }

    // recibe id, devuelve objecto si existe id sino null
    async getById(id) {
        let contenido = await this.getFileContent()
        const result = contenido.find((objeto) => {
            return parseInt(id) === objeto.id;
        })
        return result || null;
    }

    // recibe y actualiza un producto segun su id
    async updateById(id, datos) {
        let contenido = await this.getFileContent()
        const objId = contenido.findIndex((product) => {
            return product.id === parseInt(id);
        })
        const objectoAUpdatear = contenido[objId];
        objectoAUpdatear.title = datos.title;
        objectoAUpdatear.price = datos.price;
        objectoAUpdatear.thumbnail = datos.thumbnail;
        await fs.promises.writeFile(this.nombreArchivo, `${JSON.stringify(contenido)}`);

        return objId || null;
    }


    async deleteById(id) {
        try {
            if (fs.existsSync(this.nombreArchivo)) {
                const content = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
                const newProducts = content && (JSON.parse(content).filter((element) => element.id !== parseInt(id)));
                await fs.promises.writeFile(this.nombreArchivo, `${JSON.stringify(newProducts)}`);
            } else {
                console.log('File not exist');
            }
        } catch (err) {
            console.log('Error de lectura: ', err);
        }
    }

}
