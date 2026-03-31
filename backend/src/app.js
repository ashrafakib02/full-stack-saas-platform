import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRouter from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { logger } from "./config/logger.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// everything goes under /api/v1
app.use("/api/v1", apiRouter);

app.use(errorMiddleware);

export default app;