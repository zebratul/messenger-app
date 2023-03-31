const { Sequelize, Op } = require('sequelize');
const Message = require('./models/Messages');

class MessageDatabase {
    constructor(database) {
        this.sequelize = database.sequelize;
        this.Message = Message;
    }
  async create(senderName, recipientName, title, body) {
      const message = await this.Message.create({
          sender_name: senderName,
          recipient_name: recipientName,
          title: title,
          body: body,
      });
      return message.toJSON();
  }

  async getAll(recipient, q) {
      const options = {
          where: {
              recipient_name: recipient,
          },
          order: [['created_at', 'DESC']],
      };
      const messages = await this.Message.findAll(options);
      return messages.map((message) => message.toJSON());
  }

  async getSuggestions(recipient, q) {
      const options = {
          attributes: ['id', 'recipient_name'],
          where: {
              recipient_name: {
                  [Op.iLike]: `${recipient}%`
              }
          },
          group: ['id', 'recipient_name'],
          order: [
              Sequelize.literal(`CASE WHEN recipient_name ILIKE '${recipient}%' THEN 0 ELSE 1 END`),
              'recipient_name'
          ],
          limit: 5
      };
      const suggestions = await this.Message.findAll(options);
      return suggestions.map((message) => message.recipient_name);
  }
  
}

module.exports = MessageDatabase;
