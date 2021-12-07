const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const bcrypt = require ('bcrypt')


const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "Digite su nombre"],
    },

    apellido: {
        type: String,
        required: [true, "Digite su apellido"],
    },
    email: {
        type: String,
        required: [true, "Por favor Digitar el email"],
        unique: [true, "Ya hay una cuenta asociada a este email"],
        index: true,
        lowercase: true,
        validate: [isEmail, "Digite un email valido."],
    },
    password: {
        type: String,
        required: [true, "Ingrese su contraseña"],
        minlength: [6,"Minimo 6 caracteres para la contraseña"],
    },
});

//Encriptacion de contraseña, antes de guardarse en la BD
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Metodo para validar la contraseña
userSchema.statics.login = async function ( email, password) {
    const user = await User.findOne( { email: email } );

    if(user){
        const autorizado = await bcrypt.compare(password, user.password);
        if(autorizado){
            return user._id;
        } else{
            throw Error("login: Contraseña incorrecta");
        } 
    } else {
        throw Error("login: Correo ingresado no existe");
    }
}

const User = mongoose.model("User", userSchema)
module.exports = User;