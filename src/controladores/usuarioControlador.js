const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { db } = require('../config/database');
const { Op } = require("sequelize");

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'secreto123';


//iniciar sesion
const IniciarSesion = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    // Buscar la credencial con la persona y rol relacionados
    const credencial = await db.usuario.findOne({
      where: { usuario },
      include: [
  {
    model: db.personal,
    include: [
      {
        model: db.persona,
        include: [
          { model: db.roles, as: 'roles' },
          { model: db.estado }
        ]
      }
    ]
  }
]

    });

    if (!credencial) {
      return res.status(401).json({ error: 'Usuario o contraseña incorecto, por fabor vuelva intentarlo' });
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const contrasenaValida = await bcrypt.compare(contrasena, credencial.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id_persona: credencial.id_persona, usuario: credencial.usuario },
      SECRET_KEY,
      { expiresIn: '30m' }
    );

    // Extraer nombre de persona y nombre del rol
    const nombreCompleto = credencial.personal.persona.nombre + " " + credencial.personal.persona.ap_paterno;
    const correo = credencial.personal.persona.correo;
    const estado = credencial.personal.persona.estado.nombre;
    const id_persona = credencial.personal.persona.id_persona;
    const roles = credencial.personal.persona.roles.nombre;

    res.json({
      usuario: credencial.usuario,
      token,
      correo: correo,
      nombreCompleto: nombreCompleto,
      roles: roles,
      estado: estado,
      id_persona: id_persona
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// listar usuario
const listarUsuario = async (req, res) => {
  try {
    const lista = await db.usuario.findAll({
      include: [
        {
          model: db.personal,
          include: [{ model: db.persona,
            include:[{model: db.roles, as: "roles"},
              {model: db.estado}
            ]
          },]
        },
      ]

    })
    return res.json(lista)
  } catch (error) {
    console.log(error);

  }
}




//registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    req.body.id_persona = req.body.personal?.id_persona;

    // Verificar si se envió una contraseña y hashearla
    if (req.body.contrasena) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.contrasena, saltRounds);
      req.body.contrasena = hashedPassword;
    }

    const persona = await db.usuario.create(req.body);
    res.status(201).json(persona);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar  usuario' });
  }
};

// editar usuario
const modificarUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        req.body.id_persona = req.body.personal?.id_persona;
        // Verificar si se envió una nueva contraseña
        if (req.body.contrasena) {
            // Hashear la contraseña antes de guardar
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.contrasena, saltRounds);
            req.body.contrasena = hashedPassword;
        }

        // Verificar si ya existe una credencial con ese usuario
        const existente = await db.usuario.findOne({ where: { usuario: id } });

        if (existente) {
            // Modificar credencial
            await db.usuario.update(req.body, { where: { usuario: id } });
            res.status(200).json({ mensaje: 'Credencial modificada' });
        } else {
            // Registrar nueva credencial
            req.body.usuario = id;
            await db.usuario.create(req.body);
            res.status(201).json({ mensaje: 'Credencial registrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar o registrar credencial' });
    }
};


module.exports = { IniciarSesion, registrarUsuario, listarUsuario, modificarUsuario };
