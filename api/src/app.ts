import express, { Request, Response } from "express";
import morgan from "morgan";
import { envs } from "./config/";

(async () => {
  await main();
})();

async function main() {
  const app = express();
  const PORT = envs.PORT ?? 30000;

  app.use(morgan("common"));
  app.use(express.json());
  app.listen(3000, () => {
    console.log(
      `🚀 la app esta corriendo fuerte en el contenedor http://localhost:${PORT} \n`,
      `Para ingresar de afuera solo http://localhost`,
    );
  });
}
