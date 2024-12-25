"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
class PackageTable extends sequelize_1.Model {
}
PackageTable.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    per_month_charges: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    yearly_per_month_charges: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    package_subscriptionId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    monthly_sub_priceId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    yearly_sub_priceId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    package_reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    features: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "packages-table",
    timestamps: false,
});
exports.default = PackageTable;
