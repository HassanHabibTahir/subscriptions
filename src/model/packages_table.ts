import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class PackageTable extends Model {
  public id!: number;
  public title!: string;
  public per_month_charges!: number;
  public yearly_per_month_charges!: number;
  public package_subscriptionId!: string;
  public monthly_sub_priceId!: string;
  public yearly_sub_priceId!: string;
  public package_reference!: string;
  public features!: string;
  public is_deleted!: boolean;
  public is_active!: boolean;
  public created_at!: Date;
}

PackageTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    per_month_charges: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    yearly_per_month_charges: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    package_subscriptionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthly_sub_priceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearly_sub_priceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "packages-table",
    timestamps: false,
  }
);

export default PackageTable;
