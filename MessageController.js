const { Sequelize } = require('sequelize');
const MessageDatabase = require('./MessageDatabase');

class MessageController {
    constructor(io, database) {
        this.messageDatabase = new MessageDatabase(database);
        this.io = io;
    }
  
    async createMessage(req, res) {
        const { sender_name, recipient_name, title, body } = req.body;
        try {
            const message = await this.messageDatabase.create(
                sender_name,
                recipient_name,
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

      async getSuggestions(req, res) {
          const { recipient } = req.params;
          const { q } = req.query;
          try {
              const suggestions = await this.messageDatabase.getSuggestions(recipient, q);
              res.status(200).json({ data: suggestions });
          } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Server error' });
          }
      }
      
  }
  
  module.exports = MessageController;
  