const MessageDatabase = require('./MessageDatabase');

class MessageController {
    constructor(io, database) {
      this.messageDatabase = new MessageDatabase(database.sequelize);
      this.io = io;
    }
  
    async createMessage(req, res) {
      const { senderName, recipientName, title, body } = req.body;
  
      try {
        const message = await this.messageDatabase.create(
          senderName,
          recipientName,
          title,
          body
        );
        this.io.emit('newMessage', message);
        res.status(201).json({ message: 'Message created', data: message });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  
    async getMessages(req, res) {
        const { recipient } = req.params;
        const { q } = req.query;
      
        try {
          const messages = await this.messageDatabase.getAll(recipient, q);
          res.status(200).json({ data: messages });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }
  }
  
  module.exports = MessageController;
  