import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import { ingresar, productos, registrarse, salir } from "./routers/routers.js";
import productosTest from "./routers/routersTest.js";
import { info, infoCompre } from "./routers/info.js";
import apiRandom from "./routers/apiRandom.js";
import { createServer } from "http";
import { Server } from "socket.io";
import container from "./containers/containerChat.js";
import { normalize, schema } from "normalizr";
import util from "util";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import cluster from "cluster";
import logger from "./utils/logers.js";

const app = express();

if (cluster.isPrimary) {
	logger.info(`Master processID: ${process.pid} is running`);

	for (let index = 1; index < 2; index++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) => {
		logger.info(`worker ${worker.process.pid} termino`);
		cluster.fork();
	});
} else {
	const MONGO = process.env.MONGO;
	const port = process.env.PORT;
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const chat = new container();
	const httpServer = createServer(app);
	const io = new Server(httpServer);
	const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

	app.set("views", "./views");
	app.set("view engine", "pug");

	app.use(cookieParser());
	app.use(
		session({
			store: MongoStore.create({
				mongoUrl: MONGO,
				mongoOptions: advancedOptions,
			}),
			secret: "coderhouse",
			resave: false,
			saveUninitialized: false,
			rolling: true,
			cookie: { maxAge: 600000 },
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(__dirname + "/Public"));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use("/ingresar", ingresar);
	app.use("/productos", productos);
	app.use("/registrarse", registrarse);
	app.use("/salir", salir);
	app.use("/test", productosTest);
	app.use("/info", info);
	app.use("/infoCompre", infoCompre);
	app.use("/apirandom", apiRandom);

	app.get("/", (req, res) => {
		res.redirect("/productos");
	});

	app.get("*", (req, res) => {
		const { url, method } = req;
		logger.warn(`Ruta ${method} ${url} no esta implementada`);
		res.send(`Ruta ${method} ${url} no esta implementada`);
	});

	io.on("connection", async (socket) => {
		const listaMensajes = await chat.getChat();
		const strin = JSON.stringify(listaMensajes);
		const data = JSON.parse(strin);
		const mensajes = {
			id: "backendCoder09",
			messages: data,
		};
		// print(mensajes);

		const authorSchema = new schema.Entity(
			"author",
			{},
			{ idAttribute: "email" }
		);
		const messageSchema = new schema.Entity("message", {
			author: authorSchema,
		});
		const messagesSchema = new schema.Entity("messages", {
			messages: [messageSchema],
		});
		const messagesNorm = normalize(mensajes, messagesSchema);
		// print(messagesNorm);

		const compresion =
			100 -
			(JSON.stringify(messagesNorm).length * 100) /
				JSON.stringify(mensajes).length +
			"%";
		socket.emit("messages", messagesNorm);
		socket.emit("compres", compresion);

		socket.on("new-message", async (data) => {
			if (listaMensajes.length === 0) {
				return await chat.addChat({
					...data,
					fyh: new Date().toLocaleString(),
					id: 1,
				});
			}
			await chat.addChat({
				...data,
				fyh: new Date().toLocaleString(),
				id: listaMensajes.length + 1,
			});

			io.sockets.emit("messages", messagesNorm);
		});
	});

	function print(objeto) {
		logger.info(util.inspect(objeto, false, 12, true));
	}

	httpServer.listen(port, () => {
		logger.info(`RUN http://localhost:${port} processID: ${process.pid}`);
	});
}
