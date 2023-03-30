const { DataTypes } = require('sequelize');

class MessageDatabase {
  constructor(sequelize) {
    this.Message = sequelize.define('Message', {
      sender_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipient_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  }

  async sync() {
    await this.Message.sync({ force: false });
    console.log('Message table created');
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
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { body: { [Op.iLike]: `%${q}%` } },
        ],
      },
      order: [['created_at', 'DESC']],
    };
    const messages = await this.Message.findAll(options);
    return messages.map((message) => message.toJSON());
  }
  
}

module.exports = MessageDatabase;
