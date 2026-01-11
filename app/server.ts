import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import webRouter from "./routes";

export const createServer = (): Application => {
	const app = express();

	app.use(
		cors({
			origin: ["http://localhost:3000", "http://localhost:3001", "https://taban-fe.liara.run", "https://memaryab.com","https://rasmiyab.com"],
		})
	);

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json({ type: "application/json" }));

	app.use("/api", webRouter);

	return app;
};
