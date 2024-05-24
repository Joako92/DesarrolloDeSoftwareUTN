const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors = require('cors');

// Configura la aplicación Express
const app = express();
app.use(express.json());
app.use(cors()); 

// Configura la conexión Sequelize (base de datos SQLite en memoria)
const sequelize = new Sequelize('sqlite::memory:');

// Define el modelo Paquete
const Paquete = sequelize.define('Paquete', {
    id: { type:DataTypes.INTEGER, primaryKey: true },
    destino: DataTypes.STRING,
    duracion: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    descripcion: DataTypes.TEXT
}, { timestamps: false });

// Inicializa la base de datos e inserta datos de muestra
async function inicializarBaseDeDatos() {
    await sequelize.sync({ force: true });
    await Paquete.bulkCreate([
        { id: 1, destino: 'Cancún, México', duracion: '7 días', precio: 1200, descripcion: 'Disfruta de playas paradisíacas y ruinas mayas.' },
        { id: 2, destino: 'Machu Picchu, Perú', duracion: '5 días', precio: 850, descripcion: 'Explora la ciudad perdida de los Incas en los Andes.' },
        { id: 3, destino: 'Roma, Italia', duracion: '10 días', precio: 1500, descripcion: 'Descubre la historia y cultura de la antigua Roma.' },
        { id: 4, destino: 'París, Francia', duracion: '5 días', precio: 1300, descripcion: 'Romance y cultura en la ciudad de la luz.' },
        { id: 5, destino: 'Tokio, Japón', duracion: '8 días', precio: 2100, descripcion: 'Experimenta la mezcla de tradición y modernidad.' },
        { id: 6, destino: 'Nueva York, USA', duracion: '6 días', precio: 1700, descripcion: 'La ciudad que nunca duerme.' },
        { id: 7, destino: 'Londres, Inglaterra', duracion: '7 días', precio: 1450, descripcion: 'Historia y cultura en la capital británica.' },
        { id: 8, destino: 'Río de Janeiro, Brasil', duracion: '5 días', precio: 900, descripcion: 'Playas, carnaval y el Cristo Redentor.' },
        { id: 9, destino: 'Buenos Aires, Argentina', duracion: '4 días', precio: 550, descripcion: 'Tango, gastronomía y cultura porteña.' },
        { id: 10, destino: 'Madrid, España', duracion: '6 días', precio: 1100, descripcion: 'Arte, historia y vida nocturna.' }, 
    ]);
}

// Endpoint home
app.get('/', async (req, res) => {
    res.send("Estas en casa.")
});

// Endpoint para buscar por descripción
app.get('/paquetes/consulta/:desc', async (req, res) => {
    const desc = req.params.desc
    console.log(desc)
    
    const lst = await Paquete.findAll({
        where: {
            descripcion: {
                [Op.like]: `%${desc}%`
            }
        }
    })
    res.json(lst)
});

// Endpoint para obtener todos los paquetes
app.get('/paquetes', async (_, res) => {
    const paquetes = await Paquete.findAll();
    res.json(paquetes);
});

// Endpoint para agregar nuevo paquete
app.post('/agregar', async (req, res) => {
    
    const { id, destino, duracion, precio, descripcion } = req.body;

    try {
        await Paquete.create({
            id: id,
            destino: destino,
            duracion: duracion,
            precio: precio,
            descripcion: descripcion
        });

        res.status(201).json({ message: 'Paquete agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar el paquete:', error);
        res.status(500).json({ message: 'Error al agregar el paquete. Por favor, inténtelo de nuevo.' });
    }
});


// Endpoint para borrar un paquete
app.delete('/paquetes/:id', async (req, res) => {
    const paq = await Paquete.findOne({
        where: {
            id: req.params.id
        }
    })
    if (paq) {
        await paq.destroy()
        res.json(paq)
    } else
        res.status(404).send({ mensaje: 'Paquete no encontrado' })
});

// Inicia el servidor
inicializarBaseDeDatos().then(() => {
    app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
});
