const User = require("../models/User");
const jwt = require('jsonwebtoken');

const manejoDeErrores = (error) => {

    let errors = { email:"", password: "" };

    //contraseña incorrecta
    if (error.message === "login: Contraseña incorrecta"){
        errors.email = "Email y/o contraseña incorrectos";
        errors.password = "Email y/o contraseña incorrectos";
    }
    //Email incorrecto
    if (error.message === "login: Correo ingresado no existe"){
        errors.email = "Email y/o contraseña incorrectos";
        errors.password = "Email y/o contraseña incorrectos";
    }

    if (error.code === 11000) {
        errors.email = "El email ya se encuentra registrado";
    }

    if (error.message.includes("User validation failed")){
        Object.values(error.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 24 * 60 *60

//Creacion de token con jwt -> Transmitimos la informacion del usuario, entre cliente servidor de forma segura.
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
}

module.exports.postRegistrar = async (req,res) => {
    console.log("postRegistrar");
    const { email, password, nombre, apellido } = req.body;
    
    try{
        const user = await User.create({ email, password, nombre, apellido });
        const token = createToken(user._id);
        //Enviamos el token en las cookies del navegador
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({id: user._id, email});

    }catch (error){
        const errors = manejoDeErrores(error);
        res.status(400).json(errors);
    }
    
}

module.exports.postIniciarSesion = async (req,res) => {
    console.log("postIniciarSesion");
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    
    try{
        const user = await User.login( email, password );
        const token = createToken(user._id);
        //Enviamos el token en las cookies del navegador
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        console.log(token);
        res.status(200).json({id: user._id, email })

    }catch (error){
        const errors = manejoDeErrores(error);
        res.status(400).json(errors);
    }
    
}

module.exports.postCerrarSesion = async (req,res) => {
    console.log("postCerrarSesion");
    res.cookie("jwt", "", { maxAge: 1 })
    res.send('postCerrarSesion');
}