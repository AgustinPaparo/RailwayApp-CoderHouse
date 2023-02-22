import { Router } from "express";
import { fork } from "child_process";
import path from "path";
import logger from "../utils/logers.js";

const apiRandom = Router();

apiRandom.get("/", (req, res) => {
	logger.info(`Ruta ${method} ${url}`);
	const cantidad = req.query.cant || 800000000;

	const calculo = fork(path.resolve(process.cwd(), "./middleware/calculo.js"));
	calculo.on("message", (result) => {
		if (result == "listo") {
			calculo.send(cantidad);
		} else {
			res.json(result);
		}
	});
});

export default apiRandom;
