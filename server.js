const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const Database = require("./Database");
const MessageController = require("./MessageController");

class Server {
    constructor() {
        this.app = express();
        this.server = http.Server(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });
        this.database = new Database();
        this.database.connect();
        this.messageController = new MessageController(this.io, this.database);
        this.config();
        this.routes();
  }

  config() {
      const bodyParser = require("body-parser");
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: true }));

      this.app.use((req, res, next) => {
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept"
          );
          next();
      });
  }

  routes() {
      const router = express.Router();
    
      router.post("/messages", async (req, res) => {
          await this.messageController.createMessage(req, res);
      });
    
      router.get("/messages/:recipient", async (req, res) => {
          await this.messageController.getMessages(req, res);
      });
    
      router.get("/suggestions/:recipient", async (req, res) => {
          await this.messageController.getSuggestions(req, res);
      });
      
      this.app.use(router);
  }
  
}

const server = new Server();
server.server.listen(5000, () => {
    console.log(`Listening on port ${5000}...`);
});
