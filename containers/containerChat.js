import mongoose from "mongoose";
import modelsChat from "../models/modelsChat.js";
import logger from "../utils/logers.js";

const MONGO = process.env.MONGO;

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
	async getChat() {
		const data = await modelsChat.find({}, { _id: 0, __v: 0 });
		return data;
	}

	async addChat(data) {
		const dataAdd = new modelsChat(data);
		const add = await dataAdd.save();
		return add;
	}
}
