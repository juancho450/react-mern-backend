/*
    Rutas de Eventos 
    host + /api/events
*/

const { Router } = require("express");
const { validateJWT } = require("../middlewares/jwt-validator");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { fieldValidators } = require("../middlewares/field-validators");
const { check } = require("express-validator");
const { isDate } = require("../helpers/isDate");

const router = Router();

// Todas tienen que pasar por la validación del JWT
router.use(validateJWT);

//CRUD: Eventos
router.get("/", getEvents);

router.post("/", [
    check("title", "The title is required").not().isEmpty(),
    check("start", "The start date is required").custom(isDate),
    check("end", "The end date is required").custom(isDate),
    fieldValidators
], createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;
