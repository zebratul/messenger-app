const { Sequelize, DataTypes } = require('sequelize');

const connectionString = 'postgres://zebratul:CGp74kEgDKIm@ep-blue-paper-507633.eu-central-1.aws.neon.tech/neondb'
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        } 
    },
    logging: false
});

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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
}, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Message;
