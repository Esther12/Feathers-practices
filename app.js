const feathers = require("@feathersjs/feathers");

const app = feathers();

class MessageService {
  constructor() {
    this.messages = [];
  }

  async find() {
    //return all messages
    return this.messages;
  }
  async create(data) {
    const message = {
      id: this.messages.length,
      text: data.text
    };

    //push new message to the list
    this.messages.push(message);

    return message;
  }
}

//register the message service on the Feather application
app.use("messages", new MessageService());

// log every time a new message has been created

app.service("messages").on("created", message => {
  console.log("A new message has been created!!!", message);
});

const main = async () => {
  // Create a new message on our messagese service

  await app.service("messages").create({
    text: "Hello Feathers"
  });

  await app.service("messages").create({
    text: "hello fellow bro!!"
  });

  const messages = await app.service("messages").find();

  console.log("all message: ", messages);
};

main();
