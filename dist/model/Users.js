"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const UsersTable = sequelize_2.default.define("users_table", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    display_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    City: {
        type: sequelize_1.DataTypes.STRING,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
    },
    membership_type: {
        type: sequelize_1.DataTypes.STRING,
    },
    payment_plane: {
        type: sequelize_1.DataTypes.STRING,
    },
    package_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    forget_password_code: {
        type: sequelize_1.DataTypes.STRING,
    },
    display_real_name: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    last_login: {
        type: sequelize_1.DataTypes.DATE,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    update_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.default = UsersTable;
