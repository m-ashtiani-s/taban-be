import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import webRouter from "./routes";

export const createServer = (): Application => {
	const app = express();

	const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	app.use(
		cors({
			origin: allowedOrigins,
		})
	);

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json({ type: "application/json" }));

	app.use("/api", webRouter);

	return app;
};
