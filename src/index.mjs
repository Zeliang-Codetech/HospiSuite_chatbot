import express from "express";
import dotenv from "dotenv";
import webhookRouter from './routes/webhook.mjs'
//DB
import mongoose from "./database.mjs";

// configurations
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(express.json());

// routes
app.use('/webhook', webhookRouter);

// default endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: `server is up and running at PORT : ${port}` })
});
// server initialization

try {
  if (mongoose.connection.readyState) {
    console.log(`DB connection state: ${mongoose.connection.readyState}`);
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}
catch (error) {
  console.error('SERVER error',error);
  process.exit(1);
}

