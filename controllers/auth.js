const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { generateJWT } = require("../helpers/jwt");


const createUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'The user already exists with that email'
            });
        }

        user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }

}

const authUser = async (req, res) => {

    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'The user does not exist with that email or password'
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password is not valid'
            });
        }


        //Generar JWT
        const token = await generateJWT(user.id, user.name);


        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }


}

const renewToken = async (req, res) => {

    const {uid, name } = req;

    //Generar un nuevo JWT y retornarlo en esta petición
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    createUser,
    authUser,
    renewToken
}