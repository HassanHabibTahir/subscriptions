import { Model, DataTypes } from 'sequelize';
import sequelize from "../sequelize";


class User extends Model {
  public id!: number;
  public type!: string;
  public name!: string;
  public username!: string;
  public display_name!: string;
  public email!: string;
  public password!: string;
  public image_url!: string;
  public City!: string;
  public state!: string;
  public membership_type!: string;
  public payment_plane!: string;
  public package_id!: number;
  public forget_password_code!: string;
  public display_real_name!: boolean;
  public is_deleted!: boolean;
  public is_verified!: boolean;
  public last_login!: Date;
  public created_at!: Date;
  public updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    City: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    membership_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_plane: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    forget_password_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    display_real_name: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'users',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  }
);

export default User;






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
