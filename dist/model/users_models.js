"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    display_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    City: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    membership_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    payment_plane: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    package_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    forget_password_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    display_real_name: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
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
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'users-table',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
});
exports.default = User;
// import { DataTypes } from "sequelize";
// import sequelize from "../sequelize";
// const UsersTable = sequelize.define("users_table", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   type: {
//     type: DataTypes.STRING,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   username: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
//   display_name: {
//     type: DataTypes.STRING,
//   },
//   email: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   image_url: {
//     type: DataTypes.STRING,
//   },
//   City: {
//     type: DataTypes.STRING,
//   },
//   state: {
//     type: DataTypes.STRING,
//   },
//   membership_type: {
//     type: DataTypes.STRING,
//   },
//   payment_plane: {
//     type: DataTypes.STRING,
//   },
//   package_id: {
//     type: DataTypes.INTEGER,
//   },
//   forget_password_code: {
//     type: DataTypes.STRING,
//   },
//   display_real_name: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
//   is_deleted: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
//   is_verified: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
//   last_login: {
//     type: DataTypes.DATE,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   update_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// });
// export default UsersTable;
