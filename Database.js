const { Sequelize } = require('sequelize');
require('dotenv').config();
const Messages = require('./models/Messages'); // import the Messages model

class Database {
  constructor() {
    this.sequelize = new Sequelize(
      process.env.PGDATABASE,
      process.env.PGUSER,
      process.env.PGPASSWORD,
      {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        dialect: 'postgres',
        dialectOptions: {
          ssl: process.env.PGSSL === 'true',
          rejectUnauthorized: process.env.PGSSLREQUIRE === 'true',
        },
        logging: false,
      }
    );
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
      
      // create the "Messages" table in the database
      await this.sequelize.sync();
      
      // query the "Messages" table and print the contents
      const messages = await Messages.findAll();
      console.log(messages);
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}

module.exports = Database;
