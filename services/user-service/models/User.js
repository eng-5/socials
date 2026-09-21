// models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true, // nullable so OAuth users (no password) can exist later
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

//  Hash password automaticallly before saving, only if it changed
User.beforeCreate(async (user) => {
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

// Instance method to check a plaintext password against the stored hash
User.prototype.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);

};

module.exports = User;