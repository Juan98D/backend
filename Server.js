/**
 * author: Juan Pablo Borrero.
 * Servidor shoplearning
 * Requerimos nuestras dependencias.
 */
const express = require ('express');
const mongoose = require ('mongoose');
const morgan = require ('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors')
// dotenv nos sirve para mantener variables de entorno, las cuales se mantendran el archivo .env - se utiliza para proteccion de información sensible.
require('dotenv').config();
const authRouthes = require('./routes/authRouthes')

var corsOptions = {
    origin: "http://localhost:3000",
    optionSuccesStatus: 200,
    credentials: true,
};

//Creamos nuestro servidor

const app= express();

//CONEXION A LA BASE DE DATOS

mongoose.connect(
    "mongodb://"+
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASSWORD + 
    "@" +
    process.env.DB_HOST + 
    ":" +
    process.env.DB_PORT + 
    "/" +
    process.env.DB_NAME +
    "?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
.then( () => {
    console.log("Connect to Mongo at: " + process.env.DB_HOST);
    app.listen(process.env.PORT || 5000); //Ponemos en escucha nuestro servidor.
    console.log("Listening on PORT: " + process.env.PORT);
}) 
.catch((err) => console.log(err));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true })); //decodificación del body en los request
app.use('/auth', authRouthes)
