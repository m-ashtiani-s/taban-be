import "dotenv/config";
import { connectDatabase } from "./config/database";
import { createServer } from "./app/server";
import Config from "./config/config";

const start = async () => {
	await connectDatabase();

	const app = createServer();
	const PORT = Config.port;

	app.listen(Number(PORT), Config.host, () => {
		console.log(`🚀 Server running on ${Config.host}:${PORT}`);
	});
};

start();
