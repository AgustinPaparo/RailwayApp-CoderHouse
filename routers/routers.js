import { get, add, update, Delete } from "../controlers/controlerProductos.js";
import {
	getSignIn,
	getSignUp,
	getLogout,
} from "../controlers/controlerUsuario.js";
import passport from "passport";
import { register, login } from "../middleware/registerLoginPassport.js";
import requireAuthentication from "../middleware/requireAuthentication.js";
import { Router } from "express";
import logger from "../utils/logers.js";

const productos = Router();
const ingresar = Router();
const registrarse = Router();
const salir = Router();

passport.use("register", register);
passport.use("login", login);

ingresar.get("/", getSignIn);

ingresar.post(
	"/",
	passport.authenticate("login", {
		failureRedirect: "/ingresar/errorIngresar",
		successRedirect: "/productos",
	})
);

ingresar.get("/errorIngresar", (req, res) => {
	logger.info(`Ruta ${method} ${url}`);
	res.render("login-error");
});

registrarse.get("/", getSignUp);

registrarse.post(
	"/",
	passport.authenticate("register", {
		failureRedirect: "/registrarse/errorRegistro",
		successRedirect: "/productos",
	})
);

registrarse.get("/errorRegistro", (req, res) => {
	logger.info(`Ruta ${method} ${url}`);
	res.render("register-error");
});

salir.get("/", getLogout);

productos.get("/:id?", requireAuthentication, get);
productos.post("/", requireAuthentication, add);
productos.put("/:id", requireAuthentication, update);
productos.delete("/:id", requireAuthentication, Delete);

export { ingresar, productos, registrarse, salir };
