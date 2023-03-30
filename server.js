const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const Database = require("./Database");
const MessageController = require("./MessageController");

class Server {
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.server = http.Server(this.app);
    this.io = socketIo(this.server);

    this.database = new Database();
    this.database.connect();

    this.messageController = new MessageController(this.io, this.database);

    this.config();
    this.routes();
  }

  config() {
    require("dotenv").config();
    const bodyParser = require("body-parser");
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  routes() {
    const router = express.Router();

    router.post("/messages", async (req, res) => {
      await this.messageController.createMessage(req, res);
    });

    router.get("/messages/:recipient", async (req, res) => {
      await this.messageController.getMessages(req, res);
    });

    this.app.use(router);
  }
}

const server = new Server();
server.server.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT || 5000}...`);
});
