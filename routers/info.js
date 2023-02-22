import { Router } from "express";
import os from "os";
import compression from "compression";
import logger from "../utils/logers.js";

const numCPUs = os.cpus().length;
const Argumentos = process.argv.slice(2);
const Plataforma = process.platform;
const Version = process.version;
const Memoria = process.memoryUsage().rss;
const Path = process.execPath;
const Id = process.pid;
const Carpeta = process.cwd();

const datos = `
CPUS: Usados actualmente ${numCPUs},
Argumentos: ${Argumentos},
Pltataforma: Sistema operativo ${Plataforma},
Version: Version de node ${Version},
Memoria: Memoria total usada ${Memoria},
Path: Path de ejecucion ${Path},
Id: Id del proceso actual de trabajo ${Id},
Carpeta: Carpeta actual del proyecto ${Carpeta},
`.repeat(10);

const infoCompre = Router();
const info = Router();

infoCompre.get("/", compression(), (req, res) => {
	logger.info(`Ruta ${method} ${url}`);
	res.send(datos);
});

info.get("/", (req, res) => {
	const { url, method } = req;
	logger.info(`Ruta ${method} ${url}`);
	res.send(datos);
});

export { info, infoCompre };
