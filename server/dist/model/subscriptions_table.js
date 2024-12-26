"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
class Subscription extends sequelize_1.Model {
}
Subscription.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    package_title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    package_reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    package_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    subscription_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    paid_amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    payment_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
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
    tableName: "subscriptions",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
});
exports.default = Subscription;
// const SubscriptionsTable = sequelize.define("subscriptions_table", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   package_title: {
//     type: DataTypes.STRING,
//   },
//   package_reference: {
//     type: DataTypes.STRING,
//   },
//   package_id: {
//     type: DataTypes.INTEGER,
//   },
//   subscription_id: {
//     type: DataTypes.STRING,
//   },
//   mode: {
//     type: DataTypes.STRING,
//   },
//   expires_at: {
//     type: DataTypes.DATE,
//   },
//   paid_amount: {
//     type: DataTypes.FLOAT,
//   },
//   payment_status: {
//     type: DataTypes.STRING,
//   },
//   status: {
//     type: DataTypes.STRING,
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
//   updated_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// });
// export default SubscriptionsTable;
