import express from "express";
import { ExpressApp } from "./services/ExpressApp";
import { DBConnnection } from "./services/DatabaseConnection";

const StartServer = () => {
  const app = express();

  DBConnnection();

  const expressApp = ExpressApp(app);

  expressApp.listen(8000, () => {
    console.log("start listen on port 8000");
  });
};

StartServer();
