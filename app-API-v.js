const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");

// A message service that allows to create new and return all message

class MessageService {
  constructor() {
    this.messages = [];
  }
  async find() {
    return this.messages;
  }
  async create(data) {
    // create a new message,  the messages list length will be the unique id

    const message = {
      id: this.messages.length,
      text: data.text
    };
    //add the new message to the list
    this.messages.push(message);

    return message;
  }
}

// Create an express compatible feathers application

const app = express(feathers());

// Parse HTTP Json

app.use(express.json());
//Parse URL0encode params
app.use(express.urlencoded({ extended: true }));
//Host static files from the current folder
app.use(express.static(__dirname));
//Add REST API support
app.configure(express.rest());
//Configuer Socket.io real-time APIs
app.configure(socketio());
//Register a inmemory message service
app.use("/messages", new MessageService());
// Resgister a nicer error handler than the default one
app.use(express.errorHandler());

// Add any new realtime connection to the `every body` Channel

app.on("connection", connection => app.channel("everybody").join(connection));

//Publish all events to the 'everybody' channel

app.publish(data => app.channel("everybody"));

// Start the server
app
  .listen(4000)
  .on("listening", () => console.log(" Listening on PORT : 4000"));

app.service("messages").create({
  text: "Hello world"
});
