const { Sequelize } = require('sequelize');
const Messages = require('./models/Messages');

class Database {
  constructor() {
    this.connectionString = 'postgres://zebratul:CGp74kEgDKIm@ep-blue-paper-507633.eu-central-1.aws.neon.tech/neondb'
    this.sequelize = new Sequelize(this.connectionString, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    });
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
      await this.sequelize.sync();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}

module.exports = Database;
