import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
class Subscription extends Model {
  public id!: number;
  public user_id!: number;
  public email!: string;
  public package_title!: string;
  public package_reference!: string;
  public package_id!: number;
  public subscription_id!: string;
  public mode!: string;
  public expires_at!: Date;
  public paid_amount!: number;
  public payment_status!: string;
  public status!: string;
  public is_deleted!: boolean;
  public is_verified!: boolean;
  public last_login!: Date;
  public created_at!: Date;
  public updated_at!: Date;
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subscription_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paid_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "subscriptions-table",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);
export default Subscription;

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
