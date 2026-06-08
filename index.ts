import "dotenv/config";
import { connectDatabase } from "./config/database";
import { createServer } from "./app/server";
import Config from "./config/config";

const start = async () => {
	await connectDatabase();

	const app = createServer();
	const PORT = Config.port;

	app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT}`);
	});
};

start();
