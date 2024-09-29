import express from "express";
import cors from "cors";
import morgan from "morgan";
import connection from "./database/connection.js";
import router from "./router/route.js";

const app = express();

/* middleware */
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.disable("x-powered-by"); // less hackers know about our stack

const port = 8081;

/* GET Requests */
app.get("/", (req, res) => {
  res.status(201).json("Home GET request");
});

/* api routes */
app.use("/api", router);

/* start server only when we have valid connection */
connection()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log("Server listening on port " + port);
      });
    } catch (error) {
      console.log("Couldn't connect");
    }
  })
  .catch(() => {
    console.log("Invalid database connection...");
  });
