import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { createServer } from "./app/server";

dotenv.config();

const start = async () => {
	await connectDatabase();

	const app = createServer();
	const PORT = process.env.PORT || 8000;

	app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT}`);
	});
};

start();
