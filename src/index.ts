import express from "express";
import db from "./database";
import servicesLoader from "./services";
import Cookies from "cookies";
import morgan from "morgan";
import http from "http";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import compress from "compression";
import { graphqlUploadExpress } from "graphql-upload";
import { IUtils } from "@interfaces/database";

const root = path.join(__dirname, "../");
const rootOut = path.join(__dirname, "../dist");
const app = express();
const server = http.createServer(app);
const utils: IUtils = {
  db,
};
const services: any = servicesLoader(utils);
const serviceNames = Object.keys(services);
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.amazonaws.com"],
      },
    })
  );
  app.use(compress());
  app.use(cors());
}
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  const devMiddleware = require("webpack-dev-middleware");
  const hotMiddleware = require("webpack-hot-middleware");
  const webpack = require("webpack");
  const config = require("../webpack.server.config");
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

app.use((req, res, next) => {
  const options = { keys: ["Some random keys"] };
  req.cookies = new Cookies(req, res, options);
  next();
});

app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use("/", express.static(path.join(root, "src/")));
app.use(
  graphqlUploadExpress({
    maxFieldSize: 10000000,
    maxFiles: 10,
  })
);

for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  switch (name) {
    case "graphql":
      services[name].applyMiddleware({ app });

      break;
    case "subscriptions":
      server.listen(process.env.PORT ? process.env.PORT : 80, () => {
        console.log(
          "Listening on port " +
            (process.env.PORT ? process.env.PORT : 80) +
            "!"
        );
        services[name](server);
      });
      break;
    default:
      app.use(`/${name}`, services[name]);
      break;
  }
}

app.get("/", (req, res) => {
  return res.status(200).end();
});

export default server;
