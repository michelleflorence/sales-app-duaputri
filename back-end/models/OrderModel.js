import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Customers from "./CustomerModel.js";

const Orders = db.define('orders',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    customerId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    totalPrice:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    // status: {
    //      type: DataTypes.INTEGER,
    //      allowNull: false,
    //      validate: {
    //         notEmpty: true
    //      }
    // }
},{
    freezeTableName: true
});

Customers.hasMany(Orders);
Orders.belongsTo(Customers, {foreignKey: 'customerId'});

export default Orders;
