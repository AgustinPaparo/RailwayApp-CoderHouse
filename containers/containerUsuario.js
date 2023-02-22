import mongoose from "mongoose";
import modelsUsuario from "../models/modelsUsuario.js";
import logger from "../utils/logers.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO = process.env.MONGO || process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose.connect(
	MONGO,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) {
			logger.error(err);
		} else {
			logger.info("MongoDB Connected");
		}
	}
);

export default class Container {
	async getUsuario(data) {
		const usuario = await modelsUsuario.findOne({ username: data });
		return usuario;
	}

	async addUsuario(data) {
		const dataAdd = new modelsUsuario(data);
		const add = await dataAdd.save();
		return add;
	}
}
