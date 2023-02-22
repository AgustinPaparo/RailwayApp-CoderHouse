import mongoose from "mongoose";
import models from "../models/models.js";
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
	async add(data) {
		const dataAdd = new models(data);
		const add = await dataAdd.save();
		return add;
	}

	async get(id) {
		if (id) {
			const data = await models.findById(id);
			return data;
		} else {
			const data = await models.find();
			return data;
		}
	}

	async update(id, data) {
		const update = await models.updateOne({ _id: id }, data);
		return update;
	}

	async delete(id) {
		const deelete = await models.deleteOne({ _id: id });
		return deelete;
	}
}
